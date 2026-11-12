import type { Problem } from "./generated/types.js"

const VERSION = "4.7.0"
/// Worth another try when sending twice cannot act twice; a 429 always is.
const RETRYABLE_STATUS = new Set([408])
/// Methods that act the same however often they are sent.
const IDEMPOTENT_METHODS = new Set(["GET", "HEAD", "PUT", "DELETE", "OPTIONS"])

/**
 * A bearer token asked for before each request, as an OAuth login's that
 * is renewed as it runs out. After a 401 it is asked again with the token
 * the API refused, and the request made once more with the one it returns.
 */
export type TokenProvider = (rejected?: string) => string | Promise<string>

/** One validation failure a problem document lists. */
export type ProblemIssue = NonNullable<Problem["issues"]>[number]

/**
 * What every client takes. The generated `ClientOptions` adds the headers
 * the contract has every request carry, such as `workspaceId`.
 */
export interface BaseClientOptions {
  /**
   * An API key, or a function that provides a bearer token per request.
   * Defaults to AI_INBX_API_KEY in Node.js and Bun environments.
   */
  apiKey?: string | TokenProvider
  baseURL?: string
  timeout?: number
  maxRetries?: number
  fetch?: typeof globalThis.fetch
  defaultHeaders?: HeadersInit
}

export interface RequestOptions {
  timeout?: number
  maxRetries?: number
  headers?: HeadersInit
  signal?: AbortSignal
}

/** What an operation the API deduplicates by key takes: send, reply, forward. */
export interface IdempotentRequestOptions extends RequestOptions {
  /**
   * Sent as `Idempotency-Key`: a second request with the same key returns
   * the first one's result, so the request is retried like a `GET`.
   */
  idempotencyKey?: string
}

/** One page of a cursor list; `next_cursor` is null on the last. */
export interface Page<T> {
  data: T[]
  next_cursor: string | null
}

export interface ResponseWithRequestID<T> {
  data: T
  response: Response
  requestId: string | null
}

/** A request as the client sends it: what every resource method builds. */
export interface APIRequest {
  method: string
  path: string
  query?: object
  body?: unknown
  /**
   * The key of an operation the API deduplicates by it (send, reply,
   * forward), sent as `Idempotency-Key`. It makes the request safe to retry.
   */
  idempotencyKey?: string
  options?: RequestOptions
  responseType?: "json" | "arrayBuffer" | "text"
}

export class APIError extends Error {
  readonly status: number
  readonly code: string | null
  readonly requestId: string | null
  /** What a request that failed validation got wrong, field by field. */
  readonly issues: ProblemIssue[]
  readonly headers: Headers
  readonly body: unknown

  constructor(
    status: number,
    body: unknown,
    requestId: string | null,
    headers: Headers
  ) {
    const parsed = parseError(body)
    super(parsed.message ?? `AI Inbx API request failed with status ${status}`)
    this.name = new.target.name
    this.status = status
    this.code = parsed.code
    this.requestId = requestId
    this.issues = parsed.issues
    this.headers = headers
    this.body = body
  }

  static fromResponse(
    status: number,
    body: unknown,
    requestId: string | null,
    headers: Headers
  ): APIError {
    const ErrorClass =
      status === 400
        ? BadRequestError
        : status === 401
          ? AuthenticationError
          : status === 403
            ? PermissionDeniedError
            : status === 404
              ? NotFoundError
              : status === 408
                ? RequestTimeoutError
                : status === 409
                  ? ConflictError
                  : status === 422
                    ? UnprocessableEntityError
                    : status === 429
                      ? RateLimitError
                      : status >= 500
                        ? InternalServerError
                        : APIError
    return new ErrorClass(status, body, requestId, headers)
  }
}

export class BadRequestError extends APIError {}
export class AuthenticationError extends APIError {}
export class PermissionDeniedError extends APIError {}
export class NotFoundError extends APIError {}
export class RequestTimeoutError extends APIError {}
export class ConflictError extends APIError {}
export class UnprocessableEntityError extends APIError {}
export class RateLimitError extends APIError {}
export class InternalServerError extends APIError {}

/** The API could not be reached, or did not answer in time, after retrying. */
export class APIConnectionError extends Error {
  constructor(url: string, cause: unknown) {
    super(
      `Could not reach ${new URL(url).origin}: ${cause instanceof Error ? cause.message : String(cause)}`,
      { cause }
    )
    this.name = "APIConnectionError"
  }
}

/**
 * Whether a request that failed with `error` is worth sending again, as the
 * client's own retries judge one that cannot act twice — a `GET`, or a send,
 * reply or forward with an idempotency key, sent with the same key: a 408,
 * 429 or 5xx, or no answer at all.
 */
export function isRetryable(error: unknown): boolean {
  return error instanceof APIError
    ? shouldRetry(error.status, true)
    : error instanceof APIConnectionError
}

/** A regular awaitable SDK result with optional access to the underlying response. */
export class APIPromise<T> extends Promise<T> {
  readonly #result: Promise<ResponseWithRequestID<T>>

  constructor(result: Promise<ResponseWithRequestID<T>>) {
    super((resolve, reject) => result.then(({ data }) => resolve(data), reject))
    this.#result = result
  }

  static get [Symbol.species](): PromiseConstructor {
    return Promise
  }

  withResponse(): Promise<ResponseWithRequestID<T>> {
    return this.#result
  }
}

/**
 * An awaitable first page that can also stream every item or page.
 * Existing `await resource.list()` behavior is unchanged.
 */
export class PagePromise<T> extends APIPromise<Page<T>> {
  readonly #next: (cursor: string) => PagePromise<T>

  constructor(
    result: Promise<ResponseWithRequestID<Page<T>>>,
    next: (cursor: string) => PagePromise<T>
  ) {
    super(result)
    this.#next = next
  }

  async *iterPages(): AsyncGenerator<Page<T>, void, undefined> {
    let current: PagePromise<T> = this
    const seen = new Set<string>()
    while (true) {
      const page = await current
      yield page
      const cursor = page.next_cursor
      if (!cursor) return
      if (seen.has(cursor)) {
        throw new Error(`Pagination returned the cursor ${cursor} twice`)
      }
      seen.add(cursor)
      current = this.#next(cursor)
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<T, void, undefined> {
    for await (const page of this.iterPages()) {
      for (const item of page.data) yield item
    }
  }

  /** Collect every item. Prefer `for await` for large collections. */
  async all(): Promise<T[]> {
    const items: T[] = []
    for await (const item of this) items.push(item)
    return items
  }
}

/**
 * The transport every resource sends through. `request` and `paginate` are
 * public, for a call no resource method makes.
 */
export class APIClient {
  readonly #token: TokenProvider
  /** Whether the token comes from a provider, which can renew it. */
  readonly #renews: boolean
  readonly #baseURL: string
  readonly #timeout: number
  readonly #maxRetries: number
  readonly #fetch: typeof globalThis.fetch
  readonly #defaultHeaders: Headers

  /** `sharedHeaders` go on every request; an undefined one is left off. */
  constructor(
    options: BaseClientOptions = {},
    sharedHeaders: Record<string, string | undefined> = {}
  ) {
    const apiKey = options.apiKey ?? environmentApiKey()
    if (!apiKey) {
      throw new Error(
        "apiKey is required; pass it explicitly or set AI_INBX_API_KEY"
      )
    }
    this.#token = typeof apiKey === "function" ? apiKey : () => apiKey
    this.#renews = typeof apiKey === "function"
    this.#baseURL = (
      options.baseURL ?? "https://api.aiinbx.com/api/v2"
    ).replace(/\/+$/, "")
    this.#timeout = options.timeout ?? 60_000
    this.#maxRetries = options.maxRetries ?? 2
    this.#fetch = options.fetch ?? globalThis.fetch
    if (!this.#fetch) throw new Error("No fetch implementation is available")
    this.#defaultHeaders = new Headers({
      accept: "application/json",
      "user-agent": `aiinbx-typescript/${VERSION}`,
    })
    applyHeaders(this.#defaultHeaders, options.defaultHeaders)
    for (const [name, value] of Object.entries(sharedHeaders)) {
      if (value !== undefined) this.#defaultHeaders.set(name, value)
    }
  }

  request<T>(request: APIRequest): APIPromise<T> {
    return new APIPromise(this.#execute<T>(request))
  }

  paginate<T>(request: APIRequest): PagePromise<T> {
    const initialQuery = { ...(request.query ?? {}) }
    const load = (query: object): PagePromise<T> =>
      new PagePromise(this.#execute<Page<T>>({ ...request, query }), (cursor) =>
        load({ ...initialQuery, cursor })
      )
    return load(initialQuery)
  }

  /**
   * A list's live stream (`text/event-stream`), open and answered: the
   * response whose body the follower reads (follow.ts). No timeout — the
   * server ends it — and no retry: following reconnects on its own terms. A
   * 401 is tried once more with a renewed token, where a provider can renew
   * it.
   */
  async open(request: APIRequest): Promise<Response> {
    const url = buildURL(this.#baseURL, request.path, request.query)
    let token = await this.#token()
    let renewed = false
    while (true) {
      const headers = new Headers(this.#defaultHeaders)
      applyHeaders(headers, request.options?.headers)
      headers.set("accept", "text/event-stream")
      headers.set("authorization", `Bearer ${token}`)
      let response: Response
      try {
        response = await this.#fetch(url, {
          method: request.method,
          headers,
          signal: request.options?.signal,
        })
      } catch (error) {
        if (isAbort(error) || request.options?.signal?.aborted) throw error
        throw new APIConnectionError(url, error)
      }
      if (response.status === 401 && this.#renews && !renewed) {
        await response.body?.cancel()
        token = await this.#token(token)
        renewed = true
        continue
      }
      if (response.ok) return response
      const data = await parseResponse(response, undefined)
      throw APIError.fromResponse(
        response.status,
        data,
        getRequestId(response.headers, data),
        response.headers
      )
    }
  }

  /**
   * One request through its retries. Only a request that cannot act twice is
   * sent again — a 429 always, as the API refused it before acting. A 401 is
   * sent once more with a renewed token, where a provider can renew it.
   */
  async #execute<T>(request: APIRequest): Promise<ResponseWithRequestID<T>> {
    const maxRetries = request.options?.maxRetries ?? this.#maxRetries
    const replayable = isReplayable(request)
    const url = buildURL(this.#baseURL, request.path, request.query)
    let token = await this.#token()
    let renewed = false
    let attempt = 0

    while (true) {
      let sent: { response: Response; cleanup: () => void }
      try {
        sent = await this.#attempt(request, url, token)
      } catch (error) {
        if (isAbort(error) || request.options?.signal?.aborted) throw error
        if (!replayable || attempt >= maxRetries) {
          throw new APIConnectionError(url, error)
        }
        await sleep(retryDelay(undefined, attempt))
        attempt += 1
        continue
      }
      const { response, cleanup } = sent
      if (response.status === 401 && this.#renews && !renewed) {
        cleanup()
        token = await this.#token(token)
        renewed = true
        continue
      }
      if (shouldRetry(response.status, replayable) && attempt < maxRetries) {
        cleanup()
        await sleep(retryDelay(response.headers, attempt))
        attempt += 1
        continue
      }

      try {
        const rawResponse = response.clone()
        const data = await parseResponse(response, request.responseType)
        const requestId = getRequestId(response.headers, data)
        if (!response.ok) {
          throw APIError.fromResponse(
            response.status,
            data,
            requestId,
            response.headers
          )
        }
        return { data: data as T, response: rawResponse, requestId }
      } finally {
        cleanup()
      }
    }
  }

  async #attempt(
    request: APIRequest,
    url: string,
    token: string
  ): Promise<{ response: Response; cleanup: () => void }> {
    const timeout = request.options?.timeout ?? this.#timeout
    const timeoutController = new AbortController()
    const timeoutId = setTimeout(
      () =>
        timeoutController.abort(
          new Error(`Request timed out after ${timeout}ms`)
        ),
      timeout
    )
    const signal = combineSignals(
      timeoutController.signal,
      request.options?.signal
    )
    const headers = new Headers(this.#defaultHeaders)
    applyHeaders(headers, request.options?.headers)
    headers.set("authorization", `Bearer ${token}`)
    if (request.idempotencyKey) {
      headers.set("idempotency-key", request.idempotencyKey)
    }

    let body: BodyInit | undefined
    if (request.body !== undefined) {
      headers.set("content-type", "application/json")
      body = JSON.stringify(request.body)
    }

    try {
      const response = await this.#fetch(url, {
        method: request.method,
        headers,
        body,
        signal,
      })
      return { response, cleanup: () => clearTimeout(timeoutId) }
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }
}

export abstract class Resource {
  protected readonly client: APIClient

  constructor(client: APIClient) {
    this.client = client
  }
}

/** A path parameter, safe to place in a URL. */
export function pathSegment(value: string): string {
  return encodeURIComponent(value)
}

function environmentApiKey(): string | undefined {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> }
  }
  return runtime.process?.env?.AI_INBX_API_KEY
}

function buildURL(baseURL: string, path: string, query?: object): string {
  const url = new URL(`${baseURL}${path.startsWith("/") ? path : `/${path}`}`)
  if (!query) return url.toString()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(key, String(item))
    } else {
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

function applyHeaders(target: Headers, source?: HeadersInit): void {
  if (!source) return
  new Headers(source).forEach((value, key) => target.set(key, value))
}

function combineSignals(
  timeoutSignal: AbortSignal,
  userSignal?: AbortSignal
): AbortSignal {
  if (!userSignal) return timeoutSignal
  if (typeof AbortSignal.any === "function")
    return AbortSignal.any([timeoutSignal, userSignal])
  const controller = new AbortController()
  const abort = (event: Event) =>
    controller.abort((event.target as AbortSignal).reason)
  timeoutSignal.addEventListener("abort", abort, { once: true })
  userSignal.addEventListener("abort", abort, { once: true })
  return controller.signal
}

async function parseResponse(
  response: Response,
  responseType: APIRequest["responseType"]
): Promise<unknown> {
  // Error bodies are JSON problems whatever the endpoint returns on success.
  if (response.ok && responseType === "arrayBuffer")
    return response.arrayBuffer()
  if (response.ok && responseType === "text") return response.text()
  if (response.status === 204) return undefined
  const text = await response.text()
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function parseError(body: unknown): {
  message: string | null
  code: string | null
  issues: ProblemIssue[]
} {
  if (!body || typeof body !== "object") {
    return { message: null, code: null, issues: [] }
  }
  const record = body as Record<string, unknown>
  const nested =
    record.error && typeof record.error === "object"
      ? (record.error as Record<string, unknown>)
      : record
  return {
    message:
      typeof nested.message === "string"
        ? nested.message
        : typeof nested.detail === "string"
          ? nested.detail
          : typeof nested.title === "string"
            ? nested.title
            : null,
    code: typeof nested.code === "string" ? nested.code : null,
    issues: Array.isArray(nested.issues)
      ? nested.issues.filter(
          (issue): issue is ProblemIssue =>
            typeof issue?.path === "string" &&
            typeof issue?.message === "string"
        )
      : [],
  }
}

/** Whether sending `request` again cannot act twice: its method, or its key. */
function isReplayable(request: APIRequest): boolean {
  return (
    IDEMPOTENT_METHODS.has(request.method.toUpperCase()) ||
    !!request.idempotencyKey
  )
}

function shouldRetry(status: number, replayable: boolean): boolean {
  return (
    status === 429 ||
    (replayable && (RETRYABLE_STATUS.has(status) || status >= 500))
  )
}

/** The wait a response asks for in `Retry-After`, in ms, up to a minute. */
export function retryAfter(headers: Headers | undefined): number | null {
  const value = headers?.get("retry-after")
  if (!value) return null
  const seconds = Number(value)
  if (Number.isFinite(seconds))
    return Math.max(0, Math.min(seconds * 1_000, 60_000))
  const date = Date.parse(value)
  if (Number.isFinite(date))
    return Math.max(0, Math.min(date - Date.now(), 60_000))
  return null
}

function retryDelay(headers: Headers | undefined, attempt: number): number {
  return (
    retryAfter(headers) ??
    Math.min(500 * 2 ** attempt, 8_000) * (0.75 + Math.random() * 0.5)
  )
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function getRequestId(headers: Headers, body: unknown): string | null {
  const header = headers.get("request-id") ?? headers.get("x-request-id")
  if (header) return header
  if (body && typeof body === "object") {
    const requestId = (body as Record<string, unknown>).request_id
    if (typeof requestId === "string") return requestId
  }
  return null
}

function isAbort(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError"
}
