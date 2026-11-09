import { describe, expect, test } from "bun:test"
import { createElement } from "react"

import { version } from "../package.json"
import AIInbx, {
  APIConnectionError,
  APIError,
  AuthenticationError,
  isRetryable,
  NotFoundError,
  RateLimitError,
} from "../src/index"

function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status: init.status ?? 200,
    headers: { "content-type": "application/json", ...init.headers },
  })
}

describe("client transport", () => {
  test("renders React email components to HTML before sending", async () => {
    let capturedBody: Record<string, unknown> | undefined
    const client = new AIInbx({
      apiKey: "test_key",
      fetch: (async (_url, init) => {
        capturedBody = JSON.parse(String(init?.body))
        return json(
          { id: "email_react" },
          { status: 201, headers: { "request-id": "req_react" } }
        )
      }) as typeof fetch,
    })
    const react = createElement(
      "main",
      null,
      createElement("h1", null, "Welcome, Ada!"),
      createElement("p", null, "Your inbox is ready.")
    )
    const params = {
      from: "hello@example.com",
      to: "ada@example.com",
      subject: "Welcome",
      react,
      html: "<p>old HTML</p>",
      text: "Welcome, Ada!",
    }

    const result = await client.emails.send(params).withResponse()

    expect(capturedBody?.react).toBeUndefined()
    expect(capturedBody?.html).toContain("<!DOCTYPE html")
    expect(capturedBody?.html).toContain("Welcome, Ada!")
    expect(capturedBody?.html).not.toContain("old HTML")
    expect(capturedBody?.text).toBe("Welcome, Ada!")
    expect(params.html).toBe("<p>old HTML</p>")
    expect(params.react).toBe(react)
    expect(result.requestId).toBe("req_react")
    expect(result.response.status).toBe(201)
    expect(result.data).toEqual({ id: "email_react" })
  })

  test("reads the conventional API key environment variable", async () => {
    const previous = process.env.AI_INBX_API_KEY
    process.env.AI_INBX_API_KEY = "environment_key"
    let authorization: string | null = null
    try {
      const client = new AIInbx({
        fetch: (async (_url, init) => {
          authorization = new Headers(init?.headers).get("authorization")
          return json({ data: [], next_cursor: null })
        }) as typeof fetch,
      })
      await client.emails.list()
    } finally {
      if (previous === undefined) delete process.env.AI_INBX_API_KEY
      else process.env.AI_INBX_API_KEY = previous
    }
    expect(authorization).toBe("Bearer environment_key")
  })

  test("uses the v2 base URL, bearer auth, user agent, and idempotency key", async () => {
    let captured: { url: string; init: RequestInit } | undefined
    const client = new AIInbx({
      apiKey: "test_key",
      fetch: (async (url, init) => {
        captured = { url: String(url), init: init ?? {} }
        return json(
          { id: "email_1" },
          { status: 201, headers: { "request-id": "req_1" } }
        )
      }) as typeof fetch,
    })

    const result = await client.emails
      .send(
        {
          from: "a@example.com",
          to: "b@example.com",
          subject: "Hi",
          text: "Hello",
        },
        { idempotencyKey: "once" }
      )
      .withResponse()

    expect(captured?.url).toBe("https://api.aiinbx.com/api/v2/emails")
    const headers = new Headers(captured?.init.headers)
    expect(headers.get("authorization")).toBe("Bearer test_key")
    expect(headers.get("user-agent")).toBe(`aiinbx-typescript/${version}`)
    expect(headers.get("idempotency-key")).toBe("once")
    expect(JSON.parse(String(captured?.init.body))).toMatchObject({
      subject: "Hi",
    })
    expect(result.requestId).toBe("req_1")
    expect(result.response.status).toBe(201)
    expect(await result.response.json()).toEqual({ id: "email_1" })
    expect(result.data).toEqual({ id: "email_1" })
  })

  test("serializes list filters and cursor pagination", async () => {
    let requested = ""
    const client = new AIInbx({
      apiKey: "key",
      baseURL: "https://example.test/custom/",
      fetch: (async (url) => {
        requested = String(url)
        return json({ data: [], next_cursor: null, has_more: false })
      }) as typeof fetch,
    })

    await client.emails.list({
      cursor: "email next",
      limit: 25,
      space: "none",
      status: "sent",
    })
    const url = new URL(requested)
    expect(`${url.origin}${url.pathname}`).toBe(
      "https://example.test/custom/emails"
    )
    expect(Object.fromEntries(url.searchParams)).toEqual({
      cursor: "email next",
      limit: "25",
      space: "none",
      status: "sent",
    })
  })

  test("throws typed API errors with server details", async () => {
    const client = new AIInbx({
      apiKey: "key",
      maxRetries: 0,
      fetch: (async () =>
        json(
          { error: { code: "not_found", message: "No such email" } },
          { status: 404, headers: { "x-request-id": "req_missing" } }
        )) as typeof fetch,
    })

    const error = await client.emails
      .retrieve("email_missing")
      .catch((cause) => cause)
    expect(error).toBeInstanceOf(APIError)
    expect(error).toBeInstanceOf(NotFoundError)
    expect(error).toMatchObject({
      status: 404,
      code: "not_found",
      requestId: "req_missing",
      message: "No such email",
    })
  })

  test("parses binary endpoint errors as problems", async () => {
    const client = new AIInbx({
      apiKey: "key",
      maxRetries: 0,
      fetch: (async () =>
        json(
          {
            type: "about:blank",
            title: "Not Found",
            status: 404,
            detail: "No prepared text: preparation is failed",
            code: "not_prepared",
          },
          { status: 404 }
        )) as typeof fetch,
    })

    for (const call of [
      () => client.attachments.download("att_1"),
      () => client.attachments.content("att_1"),
    ]) {
      const error = await call().catch((cause) => cause)
      expect(error).toBeInstanceOf(NotFoundError)
      expect(error).toMatchObject({
        status: 404,
        code: "not_prepared",
        message: "No prepared text: preparation is failed",
      })
    }
  })

  test("uses status-specific error subclasses", async () => {
    for (const [status, ErrorClass] of [
      [401, AuthenticationError],
      [429, RateLimitError],
    ] as const) {
      const client = new AIInbx({
        apiKey: "key",
        maxRetries: 0,
        fetch: (async () =>
          json({ detail: "failed" }, { status })) as typeof fetch,
      })
      const error = await client.emails.list().catch((cause) => cause)
      expect(error).toBeInstanceOf(ErrorClass)
      expect(error).toBeInstanceOf(APIError)
      expect(error.name).toBe(ErrorClass.name)
    }
  })

  test("auto-paginates items while preserving the original filters", async () => {
    const urls: URL[] = []
    const client = new AIInbx({
      apiKey: "key",
      fetch: (async (input) => {
        const url = new URL(String(input))
        urls.push(url)
        return url.searchParams.get("cursor")
          ? json({ data: [{ id: "thread_2" }], next_cursor: null })
          : json({ data: [{ id: "thread_1" }], next_cursor: "next page" })
      }) as typeof fetch,
    })

    const results = await client.threads
      .list({ limit: 1, mailbox: "team@example.com" })
      .all()

    expect(results.map((thread) => thread.id)).toEqual(["thread_1", "thread_2"])
    expect(urls).toHaveLength(2)
    expect(urls[1]?.searchParams.get("cursor")).toBe("next page")
    expect(urls[1]?.searchParams.get("limit")).toBe("1")
    expect(urls[1]?.searchParams.get("mailbox")).toBe("team@example.com")
  })

  test("iterates paginated messages in a thread", async () => {
    const cursors: Array<string | null> = []
    const client = new AIInbx({
      apiKey: "key",
      fetch: (async (input) => {
        const cursor = new URL(String(input)).searchParams.get("message_cursor")
        cursors.push(cursor)
        return cursor
          ? json({
              id: "thread_1",
              messages: [{ id: "email_2" }],
              messages_next_cursor: null,
            })
          : json({
              id: "thread_1",
              messages: [{ id: "email_1" }],
              messages_next_cursor: "email_1",
            })
      }) as typeof fetch,
    })

    const ids: string[] = []
    for await (const message of client.threads.iterateMessages("thread_1", {
      message_limit: 1,
    })) {
      ids.push(message.id)
    }
    expect(ids).toEqual(["email_1", "email_2"])
    expect(cursors).toEqual([null, "email_1"])
  })

  for (const status of [408, 429, 500, 503]) {
    test(`retries HTTP ${status}`, async () => {
      let attempts = 0
      const client = new AIInbx({
        apiKey: "key",
        maxRetries: 1,
        fetch: (async () => {
          attempts += 1
          return attempts === 1
            ? json(
                { error: { message: "retry" } },
                { status, headers: { "retry-after": "0" } }
              )
            : json({ id: "domain_1" })
        }) as typeof fetch,
      })

      expect((await client.domains.retrieve("domain_1")).id).toBe("domain_1")
      expect(attempts).toBe(2)
    })
  }

  test("isRetryable says which failures the retries would have sent again", async () => {
    const failure = (status: number) =>
      new AIInbx({
        apiKey: "key",
        maxRetries: 0,
        fetch: (async () => json({}, { status })) as typeof fetch,
      }).domains
        .retrieve("domain_1")
        .catch((cause) => cause)
    for (const status of [408, 429, 500, 503]) {
      expect(isRetryable(await failure(status))).toBe(true)
    }
    for (const status of [400, 401, 404, 409, 422]) {
      expect(isRetryable(await failure(status))).toBe(false)
    }
    expect(isRetryable(new APIConnectionError("https://example.test", 0))).toBe(
      true
    )
    expect(isRetryable(new Error("bug"))).toBe(false)
  })

  test("retries a send only when it carries an idempotency key, or on a 429", async () => {
    const attemptsFor = async (status: number, idempotencyKey?: string) => {
      let attempts = 0
      const client = new AIInbx({
        apiKey: "key",
        maxRetries: 1,
        fetch: (async () => {
          attempts += 1
          return json({}, { status, headers: { "retry-after": "0" } })
        }) as typeof fetch,
      })
      const request = {
        from: "a@example.com",
        to: "b@example.com",
        subject: "Hi",
        text: "Hello",
      }
      await client.emails
        .send(request, { idempotencyKey })
        .catch((cause) => cause)
      return attempts
    }
    expect(await attemptsFor(500)).toBe(1)
    expect(await attemptsFor(500, "once")).toBe(2)
    expect(await attemptsFor(429)).toBe(2)
  })

  test("takes an idempotency key only where the API honours one", async () => {
    let attempts = 0
    let headers: Headers | undefined
    const client = new AIInbx({
      apiKey: "key",
      maxRetries: 1,
      fetch: (async (_url: string, init: RequestInit) => {
        attempts += 1
        headers = new Headers(init.headers)
        return json({}, { status: 500 })
      }) as typeof fetch,
    })
    await client.domains
      // @ts-expect-error: creating a domain is not deduplicated by key
      .create({ name: "example.com" }, { idempotencyKey: "once" })
      .catch((cause) => cause)
    expect(attempts).toBe(1)
    expect(headers?.has("idempotency-key")).toBe(false)
  })

  test("does not resend a send without a key after a network failure", async () => {
    let attempts = 0
    const client = new AIInbx({
      apiKey: "key",
      baseURL: "https://example.test/api/v2",
      maxRetries: 2,
      fetch: (async () => {
        attempts += 1
        throw new TypeError("socket closed")
      }) as typeof fetch,
    })
    const error = await client.domains
      .create({ name: "example.com" })
      .catch((cause) => cause)
    expect(error).toBeInstanceOf(APIConnectionError)
    expect(error.message).toBe(
      "Could not reach https://example.test: socket closed"
    )
    expect(attempts).toBe(1)
  })

  test("asks a token provider per request, and once more after a 401", async () => {
    const bearers: (string | null)[] = []
    const asked: (string | undefined)[] = []
    let refuseAll = false
    const client = new AIInbx({
      apiKey: async (rejected) => {
        asked.push(rejected)
        return rejected ? "fresh" : "stale"
      },
      fetch: (async (_url, init) => {
        const bearer = new Headers(init?.headers).get("authorization")
        bearers.push(bearer)
        return bearer === "Bearer fresh" && !refuseAll
          ? json({ id: "domain_1" })
          : json({ detail: "expired" }, { status: 401 })
      }) as typeof fetch,
    })
    // A POST without a key is sent again: the 401 means nothing was done.
    expect((await client.domains.create({ name: "example.com" })).id).toBe(
      "domain_1"
    )
    expect(bearers).toEqual(["Bearer stale", "Bearer fresh"])
    expect(asked).toEqual([undefined, "stale"])

    refuseAll = true
    const error = await client.domains
      .retrieve("domain_1")
      .catch((cause) => cause)
    expect(error).toBeInstanceOf(AuthenticationError)
    // Renewed once, not in a loop.
    expect(asked).toEqual([undefined, "stale", undefined, "stale"])
  })

  test("carries a problem document's issues", async () => {
    const client = new AIInbx({
      apiKey: "key",
      fetch: (async () =>
        json(
          {
            code: "invalid_request",
            detail: "Request body is invalid",
            issues: [{ path: "to", message: "Required" }],
          },
          { status: 422 }
        )) as typeof fetch,
    })
    const error = await client.domains
      .create({ name: "" })
      .catch((cause) => cause)
    expect(error).toMatchObject({
      code: "invalid_request",
      message: "Request body is invalid",
      issues: [{ path: "to", message: "Required" }],
    })
  })

  test("sends any request through the same transport", async () => {
    let captured: { url: string; init: RequestInit } | undefined
    const client = new AIInbx({
      apiKey: "key",
      workspaceId: "ws_1",
      defaultHeaders: { "user-agent": "tool/1" },
      fetch: (async (url, init) => {
        captured = { url: String(url), init: init ?? {} }
        return new Response("pong")
      }) as typeof fetch,
    })
    const text = await client.request<string>({
      method: "GET",
      path: "/ping",
      query: { a: 1 },
      responseType: "text",
    })
    expect(text).toBe("pong")
    expect(captured?.url).toBe("https://api.aiinbx.com/api/v2/ping?a=1")
    const headers = new Headers(captured?.init.headers)
    expect(headers.get("aiinbx-workspace")).toBe("ws_1")
    expect(headers.get("user-agent")).toBe("tool/1")
  })

  test("does not retry ordinary client errors", async () => {
    let attempts = 0
    const client = new AIInbx({
      apiKey: "key",
      fetch: (async () => {
        attempts += 1
        return json({ error: { message: "bad" } }, { status: 400 })
      }) as typeof fetch,
    })
    await expect(
      Promise.resolve(client.domains.create({ name: "not a domain" }))
    ).rejects.toBeInstanceOf(APIError)
    expect(attempts).toBe(1)
  })

  test("retries network failures", async () => {
    let attempts = 0
    const client = new AIInbx({
      apiKey: "key",
      maxRetries: 1,
      fetch: (async () => {
        attempts += 1
        if (attempts === 1) throw new TypeError("socket closed")
        return json({ id: "thread_1" })
      }) as typeof fetch,
    })
    expect((await client.threads.retrieve("thread_1")).id).toBe("thread_1")
    expect(attempts).toBe(2)
  })

  test("enforces per-request timeouts", async () => {
    const client = new AIInbx({
      apiKey: "key",
      maxRetries: 0,
      fetch: ((_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener(
            "abort",
            () => reject(init.signal?.reason),
            { once: true }
          )
        })) as typeof fetch,
    })
    await expect(
      Promise.resolve(client.threads.list({}, { timeout: 5 }))
    ).rejects.toThrow("timed out after 5ms")
  })

  test("downloads binary attachment bodies", async () => {
    const client = new AIInbx({
      apiKey: "key",
      fetch: (async () =>
        new Response(new Uint8Array([1, 2, 3]))) as typeof fetch,
    })
    expect(
      new Uint8Array(await client.attachments.download("attachment_1"))
    ).toEqual(new Uint8Array([1, 2, 3]))
  })
})

describe("resource paths", () => {
  test("all resource methods issue their documented verb and path", async () => {
    const calls: string[] = []
    const urls: string[] = []
    const bodies = new Map<string, unknown>()
    const client = new AIInbx({
      apiKey: "key",
      fetch: (async (url, init) => {
        urls.push(String(url))
        const call = `${init?.method} ${new URL(String(url)).pathname}`
        calls.push(call)
        if (init?.body) bodies.set(call, JSON.parse(String(init.body)))
        return json({ data: [], next_cursor: null, has_more: false })
      }) as typeof fetch,
    })

    await Promise.all([
      client.spaces.list({ external_id: "cus_1" }),
      client.spaces.create({ name: "Acme", external_id: "cus_1" }),
      client.spaces.retrieve("space_1"),
      client.spaces.update("space_1", { name: "Acme Inc", external_id: null }),
      client.spaces.delete("space_1"),
      client.apiKeys.list({ limit: 5 }),
      client.apiKeys.create({ name: "Production", scope: "sending" }),
      client.apiKeys.delete("key_1"),
      client.emails.update("email/1", {
        scheduled_at: "2026-01-01T00:00:00Z",
      }),
      client.emails.sendDraft("email_1"),
      client.emails.cancel("email_1"),
      client.emails.retrieve("email_1", { include: ["attachment_content"] }),
      client.threads.list(),
      client.threads.reply("thread/1", { text: "Thanks" }),
      client.threads.forward("thread/1", {
        to: "human@example.com",
        note: "Over to you.",
      }),
      client.domains.create({ name: "example.com" }),
      client.domains.create({ name: "acme.example.com", space_id: "space_1" }),
      client.domains.update("domain_1", { track_opens: false }),
      client.domains.diagnostics("domain_1"),
      client.domains.delete("domain_1"),
      client.domains.verify("domain_1"),
      client.mailboxes.list(),
      client.mailboxes.connect({
        provider: "google",
        return_to: "https://example.com/connected",
      }),
      client.mailboxes.disconnect("mailbox_1"),
      client.mailboxes.sync("mailbox_1"),
      client.oauthApps.list(),
      client.oauthApps.create({
        provider: "google",
        name: "App",
        slug: "app",
        client_id: "client",
        client_secret: "secret",
      }),
      client.oauthApps.update("app_1", { name: "Renamed", accent: null }),
      client.webhookEndpoints.create({
        url: "https://example.com/webhook",
        subscriptions: ["email.delivered"],
        routing: [
          { effect: "allow", field: "to", pattern: "*@example.com" },
          { effect: "block", field: "from", pattern: "spam@example.net" },
        ],
      }),
      client.webhookEndpoints.update("webhook_1", { enabled: false }),
      client.webhookEndpoints.rotateSecret("webhook_1", {
        grace_seconds: 3_600,
      }),
      client.webhookEndpoints.test("webhook_1", {
        event_type: "email.delivered",
      }),
      client.webhookEndpoints.listDeliveries("webhook_1"),
      client.webhookEndpoints.retryDeliveries("webhook_1", {
        delivery_ids: ["delivery_1"],
      }),
      client.suppressions.add({ addresses: ["no@example.com"] }),
      client.suppressions.retrieve("suppression_1"),
      client.suppressions.remove("suppression_1"),
      client.pacingRules.create({
        name: "Hourly",
        kind: "limit",
        enabled: true,
        match: [{ field: "to", pattern: "*@example.com" }],
        limit: { scope: "rule", amount: 10, per_seconds: 3_600 },
      }),
      client.pacingRules.update("rule_1", { enabled: false }),
      client.pacingRules.retrieveSpread(),
      client.pacingRules.updateSpread({ spread: 25 }),
      client.pacing.retrieve({ limit: 100 }),
      client.pacing.release({ email_ids: ["email_1"] }),
      client.attachments.content("attachment_1"),
    ])

    expect(calls).toContain("PATCH /api/v2/emails/email%2F1")
    expect(calls).toContain("GET /api/v2/spaces")
    expect(calls).toContain("POST /api/v2/spaces")
    expect(calls).toContain("GET /api/v2/spaces/space_1")
    expect(calls).toContain("PATCH /api/v2/spaces/space_1")
    expect(calls).toContain("DELETE /api/v2/spaces/space_1")
    expect(calls).toContain("GET /api/v2/api-keys")
    expect(calls).toContain("POST /api/v2/api-keys")
    expect(calls).toContain("DELETE /api/v2/api-keys/key_1")
    expect(calls).toContain("POST /api/v2/emails/email_1/send")
    expect(calls).toContain("POST /api/v2/emails/email_1/cancel")
    expect(calls).toContain("POST /api/v2/threads/thread%2F1/reply")
    expect(calls).toContain("POST /api/v2/threads/thread%2F1/forward")
    expect(calls).toContain("PATCH /api/v2/domains/domain_1")
    expect(calls).toContain("GET /api/v2/domains/domain_1/diagnostics")
    expect(calls).toContain("DELETE /api/v2/mailboxes/mailbox_1")
    expect(calls).toContain("POST /api/v2/mailboxes/mailbox_1/sync")
    expect(calls).toContain("PATCH /api/v2/oauth-apps/app_1")
    expect(calls).toContain(
      "POST /api/v2/webhook-endpoints/webhook_1/rotate-secret"
    )
    expect(calls).toContain(
      "POST /api/v2/webhook-endpoints/webhook_1/deliveries/retry"
    )
    expect(calls).toContain("GET /api/v2/suppressions/suppression_1")
    expect(calls).toContain("GET /api/v2/pacing-rules/spread")
    expect(calls).toContain("PATCH /api/v2/pacing-rules/spread")
    expect(calls).toContain("GET /api/v2/pacing-queue")
    expect(calls).toContain("POST /api/v2/pacing-queue/release")
    expect(calls).toContain("GET /api/v2/attachments/attachment_1/content")
    expect(urls).toContain(
      "https://api.aiinbx.com/api/v2/emails/email_1?include=attachment_content"
    )
    expect(urls).toContain("https://api.aiinbx.com/api/v2/api-keys?limit=5")
    expect(urls).toContain(
      "https://api.aiinbx.com/api/v2/spaces?external_id=cus_1"
    )
    expect(bodies.get("POST /api/v2/spaces")).toEqual({
      name: "Acme",
      external_id: "cus_1",
    })
    expect(bodies.get("PATCH /api/v2/spaces/space_1")).toEqual({
      name: "Acme Inc",
      external_id: null,
    })
    expect(bodies.get("POST /api/v2/webhook-endpoints")).toEqual({
      url: "https://example.com/webhook",
      subscriptions: ["email.delivered"],
      routing: [
        { effect: "allow", field: "to", pattern: "*@example.com" },
        { effect: "block", field: "from", pattern: "spam@example.net" },
      ],
    })
    expect(bodies.get("POST /api/v2/api-keys")).toEqual({
      name: "Production",
      scope: "sending",
    })
    expect(bodies.get("POST /api/v2/domains")).toEqual({
      name: "acme.example.com",
      space_id: "space_1",
    })
    expect(bodies.get("POST /api/v2/pacing-rules")).toMatchObject({
      limit: { scope: "rule", amount: 10, per_seconds: 3_600 },
    })
    expect(bodies.get("PATCH /api/v2/pacing-rules/rule_1")).toEqual({
      enabled: false,
    })
    expect(bodies.get("POST /api/v2/suppressions")).toEqual({
      addresses: ["no@example.com"],
    })
    expect(bodies.get("POST /api/v2/threads/thread%2F1/reply")).toEqual({
      text: "Thanks",
    })
    expect(bodies.get("POST /api/v2/threads/thread%2F1/forward")).toEqual({
      to: "human@example.com",
      note: "Over to you.",
    })
    expect(bodies.get("PATCH /api/v2/domains/domain_1")).toEqual({
      track_opens: false,
    })
    expect(bodies.get("POST /api/v2/webhook-endpoints/webhook_1/test")).toEqual(
      {
        event_type: "email.delivered",
      }
    )
    expect(
      bodies.get("POST /api/v2/webhook-endpoints/webhook_1/rotate-secret")
    ).toEqual({
      grace_seconds: 3_600,
    })
    expect(calls).toHaveLength(44)
  })
})
