# AI Inbx TypeScript SDK

[Website](https://aiinbx.com) · [Documentation](https://docs.aiinbx.com)

The official, dependency-free TypeScript client for AI Inbx API v2. It supports Node.js 20+, Bun, Deno, and modern edge runtimes with `fetch` and Web Crypto.

## Install

```sh
npm install aiinbx
```

## Usage

```ts
import AIInbx from "aiinbx"

const aiinbx = new AIInbx() // reads AI_INBX_API_KEY

const email = await aiinbx.emails.send(
  {
    from: { name: "Ada", address: "ada@example.com" },
    to: "grace@example.com",
    subject: "Hello",
    text: "Sent through AI Inbx.",
  },
  { idempotencyKey: "welcome-grace-v1" }
)
```

The default base URL is `https://api.aiinbx.com/api/v2`. Override it with `baseURL` for local development.

## React Email

Pass a React Email component with the `react` property:

```tsx
import AIInbx from "aiinbx"
import { WelcomeEmail } from "./emails/welcome"

const aiinbx = new AIInbx()

await aiinbx.emails.send({
  from: "Acme <hello@example.com>",
  to: "ada@example.com",
  subject: "Welcome",
  react: <WelcomeEmail name="Ada" />,
})
```

Install `@react-email/render` alongside React to use this feature; `@react-email/components` alone is not enough. The renderer is loaded only when `react` is provided. You can still include `text` as a plain-text alternative.

## Configuration

```ts
const aiinbx = new AIInbx({
  apiKey: process.env.AI_INBX_API_KEY!,
  timeout: 60_000,
  maxRetries: 2,
  // baseURL: "http://localhost:3000/api/v2",
})
```

A 429 is retried always, and network errors, HTTP 408 and 5xx when a retry cannot act twice — a `GET`, `PUT` or `DELETE`, or a send, reply or forward with an `idempotencyKey` — with bounded exponential backoff, honoring `Retry-After`. A 409 or other 4xx is never retried. `apiKey` also takes a function that returns a bearer token per request (an OAuth access token); after a 401 it is asked again with the refused token and the request is sent once more. Per-request `timeout`, `maxRetries`, `signal`, and `headers` options override client defaults; `emails.send`, `threads.reply` and `threads.forward` also take `idempotencyKey`.

## Resources

Each API resource is a property of the client — `aiinbx.emails`, `aiinbx.webhookEndpoints`, `aiinbx.pacingRules` — and every endpoint page in the [API reference](https://docs.aiinbx.com/api) shows its TypeScript call.

Every method takes, in order, the path ids, the query filters (`list`, `retrieve` on emails and threads, the pacing queue), the request body, and the request options. Bodies and responses are typed by the API's own schema names — `SendEmailRequest`, `Email`, `FullThread`, `PacingRule` — and the resources, types and method signatures are generated from the API contract, so a change to the API is a change here on the next release.

```ts
const email = await aiinbx.emails.retrieve("eml_123", {
  include: ["attachment_content"],
})
```

Replying does not require reconstructing the email headers or participants:

```ts
await aiinbx.threads.reply(
  "thr_123",
  { text: "Sounds good—see you then." },
  { idempotencyKey: "reply-thr-123-v1" }
)
```

Long threads are paginated independently from the thread list:

```ts
for await (const message of aiinbx.threads.iterateMessages("thr_123", {
  message_limit: 100,
})) {
  console.log(message.subject)
}
```

List methods remain directly awaitable for one page:

```ts
const page = await aiinbx.threads.list({ limit: 50, query: "invoice" })
```

They are also async iterables, preserving the original filters on every page:

```ts
for await (const thread of aiinbx.threads.list({
  mailbox: "team@example.com",
})) {
  console.log(thread.subject)
}

// Convenient for known-small collections:
const domains = await aiinbx.domains.list().all()

// Or iterate pages when checkpoints matter:
for await (const page of aiinbx.emails.list().iterPages()) {
  await saveCheckpoint(page.next_cursor)
}
```

## Spaces

A space groups a customer's domains, mailboxes, assigned addresses and mail. Pass `space_id` when creating a domain, mailbox, suppression or pacing rule, or when assigning a single address; emails and threads inherit the space of the address they went through when it is assigned to one, else of its domain or mailbox. Lists of those take a `space` filter: pass a space ID for that space, `"none"` for only the workspace's own resources (`space_id: null`), or omit it for both the workspace and all spaces. API keys and webhook endpoints belong to the workspace: one key reaches every space, and one endpoint receives every space's events, each stamped with its `space_id`. Spaces are optional — a workspace that never creates one sees `space_id: null` everywhere.

`external_id` is your own id for the customer — unique per workspace, so a second create for the same customer fails with `409 external_id_taken` — and `spaces.list({ external_id })` finds the space by it.

```ts
const space = await aiinbx.spaces.create({
  name: "Acme",
  external_id: "cus_8812",
})
// Later, from your side of the map:
const [same] = await aiinbx.spaces.list({ external_id: "cus_8812" }).all()
// One label under a wildcard you own (`*.mail.example.com`) is a subdomain: no DNS to publish.
await aiinbx.domains.create({
  name: "acme.mail.example.com",
  space_id: space.id,
})
await aiinbx.emails.send({
  from: "Acme <hello@acme.mail.example.com>",
  to: "ada@example.com",
  subject: "Welcome",
  text: "Sent from Acme's own subdomain.",
})
// Or one address of a verified domain you already have, in the customer's space: no DNS.
await aiinbx.addresses.assign({
  address: "anna@agents.example.com",
  space_id: space.id,
})
const assigned = await aiinbx.addresses.list({ space: space.id }).all()
await aiinbx.addresses.remove("anna@agents.example.com") // back in its domain's space
```

Use the customer's own domain when they bring one, a subdomain when each customer needs a name of their own or any number of addresses, and an assigned address when each customer — or each agent — has one or a few addresses on a domain you already have.

When several addresses of one space write to the same contacts, `thread_across_addresses` lets mail without reply headers join any thread of the space, not only one its address takes part in. It starts off; real replies always join their thread. The workspace has the same switch for mail outside spaces.

```ts
await aiinbx.spaces.update(space.id, { thread_across_addresses: true })
await aiinbx.workspaces.update({ thread_across_addresses: true })
```

## Responses and errors

Every call is awaitable. Use `.withResponse()` when you also need the response headers or request ID:

```ts
const { data, response, requestId } = await aiinbx.emails
  .retrieve("eml_123")
  .withResponse()

console.log(response.status, requestId, data.subject)
```

Non-successful responses throw `APIError` with `status`, `code`, `requestId`, `headers`, and the parsed `body`:

```ts
import { APIError, NotFoundError, RateLimitError } from "aiinbx"

try {
  await aiinbx.domains.retrieve("dom_missing")
} catch (error) {
  if (error instanceof NotFoundError) return null
  if (error instanceof RateLimitError) console.error("Try later")
  if (error instanceof APIError) console.error(error.status, error.code)
}
```

`isRetryable(error)` says whether a failure the client gave up on is worth sending again later — with the same `idempotencyKey`, where it has one — as its own retries judge it.

## Verify webhooks

Always verify the exact raw request body before parsing it. The default replay window is five minutes.

```ts
import { verifyWebhookRequest } from "aiinbx/webhooks"

export async function POST(request: Request) {
  const event = await verifyWebhookRequest(
    request,
    process.env.AI_INBX_WEBHOOK_SECRET!
  )
  // `type` is a discriminant: TypeScript knows this event's exact data.
  if (event.type === "email.received") {
    console.log(event.data.thread_id, event.data.category)
  }
  return new Response(null, { status: 204 })
}
```

For frameworks that give you the raw body and signature separately, use `verifyWebhook(rawBody, signature, secret)`.

## Contributing

The resources, types and method signatures of this SDK are generated from the AI Inbx API contract. This repository receives the source of every release published to [npm](https://www.npmjs.com/package/aiinbx), tagged with its version. [Issues](https://github.com/aiinbx/aiinbx-ts/issues) are welcome. Pull requests are too: an accepted change is ported into the source repository and arrives here with the next release.
