/**
 * The resources as the client exposes them: everything the contract generates,
 * plus what only an SDK can offer — React bodies, walking a thread's messages,
 * following a list live. The contract's `extended` list says which classes
 * are subclassed here.
 */
import {
  type APIPromise,
  APIPromise as APIPromiseClass,
  type IdempotentRequestOptions,
  type RequestOptions,
} from "./core.js"
import { follow, type FollowOptions } from "./follow.js"
import {
  GeneratedEmails,
  GeneratedEvents,
  GeneratedThreads,
} from "./generated/resources.js"
import type {
  Email,
  FullEmail,
  ListEmailsQuery,
  ListEventsQuery,
  RetrieveThreadQuery,
  SendEmailResponse,
  WebhookEvent,
} from "./generated/types.js"
import { renderReactEmail } from "./render.js"
import type { SendEmailParams } from "./types.js"

export {
  ApiKeys,
  Attachments,
  Domains,
  Invitations,
  Mailboxes,
  Members,
  OauthApps,
  Pacing,
  PacingRules,
  Spaces,
  Suppressions,
  WebhookEndpoints,
  Workspaces,
} from "./generated/resources.js"

/// What a live list is not given: it pages and ends by itself, starts at
/// `since`, and adds an email as it is, whatever its status goes on to be.
type LiveQuery<Q> = Omit<
  Q,
  "after" | "before" | "cursor" | "limit" | "order" | "status"
>

export class Emails extends GeneratedEmails {
  /** Send an email. A `react` element is rendered to `html` before the request goes out. */
  override send(
    body: SendEmailParams,
    options?: IdempotentRequestOptions
  ): APIPromise<SendEmailResponse> {
    const { react, ...request } = body
    if (react === undefined) return super.send(request, options)
    return new APIPromiseClass(
      renderReactEmail(react).then((html) =>
        super.send({ ...request, html }, options).withResponse()
      )
    )
  }

  /**
   * Every email added to the list from `since` on — or from now — as it
   * arrives, under the same filters as `list`. Runs until `signal` fires or
   * the loop is left; the server pushes, nothing polls.
   */
  follow(
    query: LiveQuery<ListEmailsQuery> = {},
    options?: FollowOptions
  ): AsyncGenerator<Email, void, undefined> {
    return follow<Email>(this.client, { path: "/emails", query }, options)
  }
}

export class Events extends GeneratedEvents {
  /**
   * Every event recorded from `since` on — or from now — as it happens,
   * under the same filters as `list`: what a webhook endpoint would be sent,
   * without one.
   */
  follow(
    query: LiveQuery<ListEventsQuery> = {},
    options?: FollowOptions
  ): AsyncGenerator<WebhookEvent, void, undefined> {
    return follow<WebhookEvent>(
      this.client,
      { path: "/events", query },
      options
    )
  }
}

export class Threads extends GeneratedThreads {
  /** Every message in a thread, oldest first, without loading it whole. */
  async *iterateMessages(
    threadId: string,
    query: Omit<RetrieveThreadQuery, "message_cursor"> = {},
    options?: RequestOptions
  ): AsyncGenerator<FullEmail, void, undefined> {
    let cursor: string | undefined
    const seen = new Set<string>()
    while (true) {
      const thread = await this.retrieve(
        threadId,
        { ...query, message_cursor: cursor },
        options
      )
      for (const message of thread.messages) yield message
      cursor = thread.messages_next_cursor ?? undefined
      if (!cursor) return
      if (seen.has(cursor)) {
        throw new Error(`Thread pagination returned the cursor ${cursor} twice`)
      }
      seen.add(cursor)
    }
  }
}
