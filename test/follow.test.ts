import { describe, expect, test } from "bun:test"

import AIInbx from "../src/index"

/**
 * Following against an API that behaves as the live lists do: each stream
 * says where the follower stands as it opens and with every message, and
 * ends after a few; the next one resumes from the last `id` read.
 */

type Item = { id: string }

/** An SSE stream: `[id, item]` messages, an item of null a bare position. */
function stream(messages: [string, Item | null][], open = false): Response {
  const body = messages
    .map(([id, item]) =>
      item ? `id: ${id}\ndata: ${JSON.stringify(item)}\n\n` : `id: ${id}\n\n`
    )
    .join("")
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(`retry: 1000\n\n: live\n\n${body}`)
        )
        // An open stream stays up until the follower leaves.
        if (!open) controller.close()
      },
    }),
    { headers: { "content-type": "text/event-stream; charset=utf-8" } }
  )
}

/** An API answering each request with the next of `answers`. */
function fakeApi(answers: (() => Response)[]) {
  const requests: { url: URL; headers: Headers }[] = []
  const client = new AIInbx({
    baseURL: "https://api.test/api/v2",
    apiKey: "k",
    fetch: (async (input: string | URL | Request, init?: RequestInit) => {
      requests.push({
        url: new URL(String(input)),
        headers: new Headers(init?.headers),
      })
      const next = answers.shift()
      if (!next) throw new Error("No answer left")
      return next()
    }) as typeof fetch,
  })
  return { client, requests }
}

describe("follow", () => {
  test("resumes each connection from the last position read", async () => {
    const { client, requests } = fakeApi([
      () =>
        stream([
          ["7:", null],
          ["8:a", { id: "a" }],
          ["9:", null],
        ]),
      () => stream([["9:b", { id: "b" }]], true),
    ])
    const controller = new AbortController()
    const seen: string[] = []
    const retried: number[] = []
    for await (const event of client.events.follow(
      { type: ["email.received"] },
      {
        signal: controller.signal,
        onRetry: (_error, delay) => retried.push(delay),
      }
    )) {
      seen.push(event.id)
      if (seen.length === 2) controller.abort()
    }
    expect(seen).toEqual(["a", "b"])
    // The first stream closed early: waited out, not hammered.
    expect(retried).toHaveLength(1)
    expect(retried[0]).toBeGreaterThanOrEqual(500)
    expect(retried[0]).toBeLessThanOrEqual(1000)
    const [first, second] = requests
    expect(first!.headers.get("accept")).toBe("text/event-stream")
    expect(first!.headers.get("last-event-id")).toBeNull()
    expect(first!.url.searchParams.getAll("type")).toEqual(["email.received"])
    expect(first!.url.searchParams.has("after")).toBe(false)
    expect(second!.headers.get("last-event-id")).toBe("9:")
  })

  test("since starts the first connection only", async () => {
    const since = new Date("2026-09-29T10:00:00.000Z")
    const { client, requests } = fakeApi([
      () => stream([["3:", null]]),
      () => stream([["4:x", { id: "x" }]], true),
    ])
    const controller = new AbortController()
    for await (const _ of client.emails.follow(
      { thread_id: "thr_1" },
      { since, signal: controller.signal, onRetry: () => {} }
    )) {
      controller.abort()
    }
    expect(requests[0]!.url.searchParams.get("after")).toBe(since.toISOString())
    expect(requests[0]!.url.searchParams.get("thread_id")).toBe("thr_1")
    expect(requests[1]!.url.searchParams.has("after")).toBe(false)
    expect(requests[1]!.headers.get("last-event-id")).toBe("3:")
  })

  test("waits out a 429 as long as it asks, and ends on a refusal waiting cannot fix", async () => {
    const limited = fakeApi([
      () => Response.json({}, { status: 429, headers: { "retry-after": "0" } }),
      () => stream([["1:a", { id: "a" }]], true),
    ])
    const controller = new AbortController()
    const retried: number[] = []
    for await (const _ of limited.client.emails.follow(
      {},
      {
        signal: controller.signal,
        onRetry: (_error, delay) => retried.push(delay),
      }
    )) {
      controller.abort()
    }
    expect(retried).toEqual([0])

    const refused = fakeApi([
      () => Response.json({ detail: "no" }, { status: 403 }),
    ])
    const run = async () => {
      for await (const _ of refused.client.emails.follow()) {
        // Nothing arrives before the 403.
      }
    }
    await expect(run()).rejects.toThrow("no")
  })

  test("ends on an answer that is not a stream", async () => {
    const { client } = fakeApi([() => Response.json({ data: [] })])
    const run = async () => {
      for await (const _ of client.emails.follow()) {
        // A proxy's page, not the list.
      }
    }
    await expect(run()).rejects.toThrow("Expected an event stream")
  })
})
