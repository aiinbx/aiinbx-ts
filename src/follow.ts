/**
 * Following a list live: every item added to it, each once, oldest first,
 * as it arrives. The API streams a list asked for `text/event-stream` for a
 * few minutes at a time and then ends it; every message carries where the
 * follower stands, and the next connection resumes exactly there
 * (`Last-Event-ID`), so a follower holds for hours or days and misses
 * nothing. The server pushes only when something happened — there is no
 * polling on either side.
 */
import { type APIClient, APIError, isRetryable, retryAfter } from "./core.js"

export interface FollowOptions {
  /**
   * Where to start: every item created from this instant on. Omitted, only
   * what is added from now.
   */
  since?: Date
  /** Stops following; the loop returns. */
  signal?: AbortSignal
  /** Told when the stream dropped and the next connection waits `delay` ms. */
  onRetry?: (error: unknown, delay: number) => void
  /** Told each time the stream stands, the first and every reconnect. */
  onConnect?: () => void
}

/** A list as it is followed: its path, and the filters of `list`. */
export interface Followable {
  path: string
  query: object
}

/// A connection that lasted this long ended as planned, not in trouble.
const STEADY = 10_000
/// The longest wait between connections while the API is away.
const MAX_BACKOFF = 60_000
/// The server sends at least a heartbeat every 20 s; nothing for this long
/// means the connection is gone without having said so.
const STALL = 45_000

class ClosedEarly extends Error {
  constructor() {
    super("The live stream closed before it settled")
    this.name = "ClosedEarly"
  }
}

class Stalled extends Error {
  constructor() {
    super("The live stream went quiet")
    this.name = "Stalled"
  }
}

class NotAStream extends Error {
  constructor(contentType: string | null) {
    super(`Expected an event stream, got ${contentType ?? "no content type"}`)
    this.name = "NotAStream"
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal?.aborted) return resolve()
    const done = () => {
      clearTimeout(timer)
      signal?.removeEventListener("abort", done)
      resolve()
    }
    const timer = setTimeout(done, ms)
    signal?.addEventListener("abort", done, { once: true })
  })
}

type Message = { id?: string; data?: string }

/** A read, or `Stalled` once nothing came for `STALL`. */
function readWithin<T>(read: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const stalled = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Stalled()), STALL)
  })
  return Promise.race([read, stalled]).finally(() => clearTimeout(timer))
}

/** Each message of a server-sent event stream: its `id` and `data`, if any. */
async function* messages(
  body: ReadableStream<Uint8Array>
): AsyncGenerator<Message> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  let message: Message = {}
  try {
    while (true) {
      const { value, done } = await readWithin(reader.read())
      if (done) return
      buffer += decoder.decode(value, { stream: true })
      let end: number
      while ((end = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, end).replace(/\r$/, "")
        buffer = buffer.slice(end + 1)
        if (line === "") {
          if (message.id !== undefined || message.data !== undefined) {
            yield message
          }
          message = {}
          continue
        }
        const colon = line.indexOf(":")
        if (colon === 0) continue
        const field = colon < 0 ? line : line.slice(0, colon)
        const value = colon < 0 ? "" : line.slice(colon + 1).replace(/^ /, "")
        if (field === "id") message.id = value
        if (field === "data") {
          message.data =
            message.data === undefined ? value : `${message.data}\n${value}`
        }
      }
    }
  } finally {
    await reader.cancel().catch(() => {})
  }
}

/**
 * Every item added to the list from `since` on — or, without it, from now —
 * each once, oldest first, until `signal` fires or the loop is left. A
 * connection the API ends is opened again at once where it left off; one
 * that fails for now (unreachable, quiet, 429, 5xx) is retried with a
 * growing wait; any other failure is thrown.
 */
export async function* follow<T>(
  client: APIClient,
  list: Followable,
  options: FollowOptions = {}
): AsyncGenerator<T, void, undefined> {
  const { signal } = options
  // Where the last message left the follower; none before the first stands.
  let position: string | undefined
  let failures = 0
  while (!signal?.aborted) {
    const opened = Date.now()
    let failure: unknown
    try {
      const response = await client.open({
        method: "GET",
        path: list.path,
        query:
          position === undefined && options.since
            ? { ...list.query, after: options.since.toISOString() }
            : list.query,
        options: {
          signal,
          headers: position === undefined ? {} : { "last-event-id": position },
        },
      })
      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("text/event-stream") || !response.body) {
        await response.body?.cancel()
        throw new NotAStream(contentType)
      }
      options.onConnect?.()
      // A stream that breaks off mid-way is the network's doing, not the
      // request's: it is waited out like an unreachable API.
      try {
        for await (const message of messages(response.body)) {
          if (message.id !== undefined) position = message.id
          if (message.data === undefined) continue
          yield JSON.parse(message.data) as T
          if (signal?.aborted) return
        }
      } catch (error) {
        if (signal?.aborted) return
        failure = error
      }
      if (!failure && Date.now() - opened >= STEADY) {
        failures = 0
        continue
      }
      failure ??= new ClosedEarly()
    } catch (error) {
      if (signal?.aborted) return
      if (!isRetryable(error)) throw error
      failure = error
    }
    failures++
    // Spread out, so followers dropped together do not come back together.
    const backoff = Math.min(MAX_BACKOFF, 1_000 * 2 ** (failures - 1))
    const delay =
      (failure instanceof APIError ? retryAfter(failure.headers) : null) ??
      backoff * (0.5 + Math.random() * 0.5)
    options.onRetry?.(failure, delay)
    await sleep(delay, signal)
  }
}
