import { describe, expect, test } from "bun:test"

import {
  signWebhook,
  verifyWebhook,
  verifyWebhookRequest,
  webhookDeliveryHeaders,
  WebhookSignatureError,
} from "../src/webhooks"

async function sign(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const bytes = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  )
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  )
}

describe("webhook verification", () => {
  test("verifies a raw payload and accepts any v1 signature during rotation", async () => {
    const secret = "whsec_test"
    const timestamp = 1_700_000_000
    const body = JSON.stringify({
      id: "event_1",
      type: "email.delivered",
      created_at: "2023-11-14T22:13:20.000Z",
      space_id: null,
      data: {
        email_id: "email_1",
        thread_id: "thread_1",
        recipients: ["grace@example.com"],
      },
    })
    const signature = await sign(secret, `${timestamp}.${body}`)
    const event = await verifyWebhook(
      body,
      `t=${timestamp},v1=wrong,v1=${signature}`,
      secret,
      { now: timestamp * 1_000 }
    )
    expect(event.type).toBe("email.delivered")
    if (event.type !== "email.delivered") throw new Error("wrong event type")
    expect(event.data).toEqual({
      email_id: "email_1",
      thread_id: "thread_1",
      recipients: ["grace@example.com"],
    })
    expect(event.data.recipients).toEqual(["grace@example.com"])
  })

  test("verifies a Request helper", async () => {
    const secret = "secret"
    const timestamp = 1_700_000_000
    const body = JSON.stringify({
      id: "event_1",
      type: "test",
      created_at: "now",
      data: {},
    })
    const signature = await sign(secret, `${timestamp}.${body}`)
    const request = new Request("https://example.com/webhooks", {
      method: "POST",
      headers: { "aiinbx-signature": `t=${timestamp},v1=${signature}` },
      body,
    })
    expect(
      (await verifyWebhookRequest(request, secret, { now: timestamp * 1_000 }))
        .id
    ).toBe("event_1")
  })

  test("rejects invalid signatures", async () => {
    await expect(
      verifyWebhook("{}", "t=1700000000,v1=bad", "secret", {
        now: 1_700_000_000_000,
      })
    ).rejects.toBeInstanceOf(WebhookSignatureError)
  })

  test("rejects timestamps outside the replay window", async () => {
    await expect(
      verifyWebhook("{}", "t=1699999000,v1=bad", "secret", {
        now: 1_700_000_000_000,
      })
    ).rejects.toThrow("outside the replay window")
  })

  test("tolerance 0 accepts only the same second, and cannot go negative", async () => {
    const timestamp = 1_700_000_000
    const body = JSON.stringify({ id: "event_1", type: "email.sent" })
    const signature = await signWebhook(body, "secret", timestamp)
    const verify = (now: number, tolerance: number) =>
      verifyWebhook(body, signature, "secret", { now, tolerance })
    expect((await verify(timestamp * 1_000 + 999, 0)).id).toBe("event_1")
    await expect(verify((timestamp + 1) * 1_000, 0)).rejects.toThrow(
      "outside the replay window"
    )
    await expect(verify(timestamp * 1_000, -1)).rejects.toBeInstanceOf(
      RangeError
    )
  })

  test("rejects modified bodies", async () => {
    const timestamp = 1_700_000_000
    const signature = await sign("secret", `${timestamp}.{"ok":true}`)
    await expect(
      verifyWebhook(
        '{"ok":false}',
        `t=${timestamp},v1=${signature}`,
        "secret",
        { now: timestamp * 1_000 }
      )
    ).rejects.toThrow("does not match")
  })

  test("delivery headers make a request verifyWebhookRequest accepts", async () => {
    const body = JSON.stringify({ id: "event_1", type: "email.sent" })
    const headers = await webhookDeliveryHeaders("event_1", body, "whsec_test")
    expect(headers["aiinbx-event-id"]).toBe("event_1")
    const request = new Request("http://localhost/webhook", {
      method: "POST",
      headers,
      body,
    })
    expect((await verifyWebhookRequest(request, "whsec_test")).id).toBe(
      "event_1"
    )
  })

  test("signs a body the way verifyWebhook checks it", async () => {
    const body = JSON.stringify({ id: "event_1", type: "email.sent" })
    const signature = await signWebhook(body, "whsec_test", 1_700_000_000)
    expect(signature).toBe(
      `t=1700000000,v1=${await sign("whsec_test", `1700000000.${body}`)}`
    )
    const event = await verifyWebhook(body, signature, "whsec_test", {
      now: 1_700_000_000_000,
    })
    expect(event.id).toBe("event_1")
  })
})
