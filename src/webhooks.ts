import type { WebhookEvent } from "./generated/types.js"

export interface VerifyWebhookOptions {
  /**
   * Maximum accepted age or clock skew in seconds; 0 accepts only the same
   * second. Defaults to 300.
   */
  tolerance?: number
  /** Override the clock for deterministic tests. */
  now?: Date | number
}

export class WebhookSignatureError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "WebhookSignatureError"
  }
}

/**
 * Verify and parse a webhook from its untouched body and `AIInbx-Signature`
 * header. Signature verification must happen before JSON parsing.
 */
export async function verifyWebhook(
  rawBody: string | Uint8Array,
  signature: string,
  secret: string,
  options: VerifyWebhookOptions = {}
): Promise<WebhookEvent> {
  if (!signature)
    throw new WebhookSignatureError("Missing AIInbx-Signature header")
  if (!secret) throw new WebhookSignatureError("Webhook secret is required")
  const tolerance = options.tolerance ?? 300
  if (!(tolerance >= 0)) throw new RangeError("tolerance must be non-negative")

  const body = text(rawBody)
  const parts = signature.split(",").map((part) => {
    const separator = part.indexOf("=")
    return [
      part.slice(0, separator).trim(),
      part.slice(separator + 1).trim(),
    ] as const
  })
  const timestampText = parts.find(([key]) => key === "t")?.[1]
  const timestamp = Number(timestampText)
  if (!timestampText || !Number.isSafeInteger(timestamp) || timestamp <= 0) {
    throw new WebhookSignatureError("Signature has an invalid timestamp")
  }

  const now = Math.floor(
    (options.now instanceof Date
      ? options.now.getTime()
      : (options.now ?? Date.now())) / 1_000
  )
  if (Math.abs(now - timestamp) > tolerance) {
    throw new WebhookSignatureError(
      "Webhook timestamp is outside the replay window"
    )
  }

  const expected = await hmac(secret, timestamp, body)
  const signatures = parts
    .filter(([key]) => key === "v1")
    .map(([, value]) => value)
  if (!signatures.some((candidate) => constantTimeEqual(candidate, expected))) {
    throw new WebhookSignatureError("Webhook signature does not match")
  }

  try {
    return JSON.parse(body) as WebhookEvent
  } catch {
    throw new WebhookSignatureError("Webhook body is not valid JSON")
  }
}

/** Read, verify, and parse a standard Node/Web Request without changing bytes first. */
export async function verifyWebhookRequest(
  request: Request,
  secret: string,
  options?: VerifyWebhookOptions
): Promise<WebhookEvent> {
  const signature = request.headers.get("aiinbx-signature") ?? ""
  return verifyWebhook(await request.text(), signature, secret, options)
}

/**
 * The `AIInbx-Signature` header for a body, as a delivery carries it:
 * `t=<unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<body>">`. For tools that
 * stand in for AI Inbx, such as a local forwarder or a test.
 */
export async function signWebhook(
  rawBody: string | Uint8Array,
  secret: string,
  timestamp = Math.floor(Date.now() / 1_000)
): Promise<string> {
  return `t=${timestamp},v1=${await hmac(secret, timestamp, text(rawBody))}`
}

/**
 * The headers a delivery of `rawBody` carries: the event's id and its
 * `AIInbx-Signature`, as `signWebhook` makes it. For the same tools.
 */
export async function webhookDeliveryHeaders(
  eventId: string,
  rawBody: string | Uint8Array,
  secret: string,
  timestamp?: number
): Promise<Record<string, string>> {
  return {
    "content-type": "application/json",
    "user-agent": "aiinbx-webhooks/1",
    "aiinbx-event-id": eventId,
    "aiinbx-signature": await signWebhook(rawBody, secret, timestamp),
  }
}

const text = (rawBody: string | Uint8Array) =>
  typeof rawBody === "string" ? rawBody : new TextDecoder().decode(rawBody)

async function hmac(
  secret: string,
  timestamp: number,
  body: string
): Promise<string> {
  const payload = `${timestamp}.${body}`
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const result = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  )
  return Array.from(new Uint8Array(result), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("")
}

function constantTimeEqual(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length)
  let difference = left.length ^ right.length
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0)
  }
  return difference === 0
}
