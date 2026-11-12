// Generated from @workspace/api-contract by `bun run sdk:generate`. Do not edit.

import {
  type APIPromise,
  type IdempotentRequestOptions,
  type RequestOptions,
  type PagePromise,
  pathSegment,
  Resource,
} from "../core.js"
import type {
  Address,
  ApiKey,
  ApiKeyCreated,
  AssignAddressRequest,
  ConnectMailboxRequest,
  ConnectMailboxResponse,
  CreateApiKeyRequest,
  CreateDomainRequest,
  CreateInvitationRequest,
  CreateOAuthAppRequest,
  CreateSpaceRequest,
  DnsDiagnosticsResponse,
  Domain,
  Email,
  ForwardThreadRequest,
  FullEmail,
  FullThread,
  IdListResponse,
  Invitation,
  InvitationList,
  ListAddressesQuery,
  ListApiKeysQuery,
  ListDomainsQuery,
  ListEmailsQuery,
  ListEventsQuery,
  ListMailboxesQuery,
  ListOAuthAppsQuery,
  ListPacingRulesQuery,
  ListSpacesQuery,
  ListSuppressionsQuery,
  ListThreadsQuery,
  ListWebhookDeliveriesQuery,
  ListWebhookEndpointsQuery,
  Mailbox,
  MailboxSyncResponse,
  Member,
  MemberList,
  OAuthApp,
  PacingQueue,
  PacingReleaseRequest,
  PacingRule,
  PacingRuleRequest,
  PacingSpread,
  PacingSpreadRequest,
  ReplyThreadRequest,
  RetrieveEmailQuery,
  RetrievePacingQueueQuery,
  RetrieveThreadQuery,
  RetryDeliveriesRequest,
  RotateWebhookSecretRequest,
  SendDraftRequest,
  SendEmailRequest,
  SendEmailResponse,
  Space,
  Suppression,
  SuppressionBatch,
  SuppressionDeleted,
  SuppressionRequest,
  Thread,
  UpdateDomainRequest,
  UpdateEmailRequest,
  UpdateMemberRequest,
  UpdateOAuthAppRequest,
  UpdatePacingRuleRequest,
  UpdateSpaceRequest,
  UpdateWebhookEndpointRequest,
  UpdateWorkspaceRequest,
  WebhookDelivery,
  WebhookEndpoint,
  WebhookEndpointCreated,
  WebhookEndpointRequest,
  WebhookEvent,
  WebhookSecretResponse,
  WebhookTestRequest,
  WebhookTestResponse,
  Workspace,
  WorkspaceList,
} from "./types.js"

/**
 * Group a workspace's domains, mailboxes and mail by customer. Optional: a
 * workspace that is not a platform never needs one.
 */
export class Spaces extends Resource {
  /**
   * List spaces. Lists the workspace's spaces, oldest first. Filter by
   * `external_id` to find the one that stands for a customer of yours.
   */
  list(
    query: ListSpacesQuery = {},
    options?: RequestOptions
  ): PagePromise<Space> {
    return this.client.paginate({
      method: "GET",
      path: "/spaces",
      query,
      options,
    })
  }

  /**
   * Create a space. Creates a space — one per customer, typically. Domains,
   * mailboxes, rules and suppressions are put in a space with `space_id` when
   * they are created, and single addresses with `POST /addresses`; every email
   * and thread inherits the space of the address it went through when that
   * address is assigned to one, else of its domain or mailbox. Anything
   * created without a `space_id` belongs to the workspace itself and
   * `space_id` reads as null. API keys and webhook endpoints belong to the
   * workspace. `external_id` is your own id for the customer: unique per
   * workspace, so a second space for the same customer is `409
   * external_id_taken`, and the space can be found by it with `GET
   * /spaces?external_id=`.
   */
  create(
    body: CreateSpaceRequest,
    options?: RequestOptions
  ): APIPromise<Space> {
    return this.client.request({
      method: "POST",
      path: "/spaces",
      body,
      options,
    })
  }

  /**
   * Retrieve a space. Returns one space by id, with its name, the
   * `external_id` you gave it and its `thread_across_addresses` switch.
   */
  retrieve(spaceId: string, options?: RequestOptions): APIPromise<Space> {
    return this.client.request({
      method: "GET",
      path: `/spaces/${pathSegment(spaceId)}`,
      options,
    })
  }

  /**
   * Update a space. Changes the space's name, `external_id` or
   * `thread_across_addresses`; only the fields given change, and `external_id:
   * null` clears it. Nothing in the space moves.
   */
  update(
    spaceId: string,
    body: UpdateSpaceRequest,
    options?: RequestOptions
  ): APIPromise<Space> {
    return this.client.request({
      method: "PATCH",
      path: `/spaces/${pathSegment(spaceId)}`,
      body,
      options,
    })
  }

  /**
   * Delete a space. Marks the space for deletion and starts its teardown in
   * the background. The space immediately stops accepting work and no longer
   * appears in the API; its domains then come off DNS verification and
   * sending, its mailboxes are disconnected, and its emails, threads, rules
   * and suppressions are removed. Addresses assigned to the space are
   * unassigned; one whose domain lives in another space is in that domain's
   * space again from its next email on. A wildcard domain in the space is
   * deleted with its subdomains, including any filed in other spaces, and a
   * domain deleted with the space takes the assignments of its addresses with
   * it, whatever space they are in. Admin only.
   */
  delete(spaceId: string, options?: RequestOptions): APIPromise<void> {
    return this.client.request({
      method: "DELETE",
      path: `/spaces/${pathSegment(spaceId)}`,
      options,
    })
  }
}

/**
 * Single addresses assigned to a space of their own, whatever space their
 * domain is in.
 */
export class Addresses extends Resource {
  /**
   * List addresses. Lists the addresses assigned to a space of their own,
   * newest first. Filter by `space` for one space's addresses, or by `address`
   * to find where one address is assigned.
   *
   * A listed assignment takes effect while the domain entry it was made on is
   * the one in service. Moving the domain to another space adds a new entry
   * for the name; once that entry sends and receives, the address is in the
   * domain's space again until it is assigned again, and the old assignment
   * stays listed until the old entry is deleted, which removes it.
   */
  list(
    query: ListAddressesQuery = {},
    options?: RequestOptions
  ): PagePromise<Address> {
    return this.client.paginate({
      method: "GET",
      path: "/addresses",
      query,
      options,
    })
  }

  /**
   * Assign an address to a space. Assigns one address of a verified domain of
   * the workspace to a space, whatever space its domain is in: one shared
   * domain, `anna@agents.com` in one customer's space and `bob@agents.com` in
   * another's, with no DNS change. The domain still signs and carries the
   * address's mail; everything else follows the address's space — its mail and
   * threads, the `space_id` on its events and emails, its send limits,
   * suppression lists and sender reputation. `space_id: null` assigns it to
   * the workspace itself.
   *
   * The address assigned on its own wins over its domain's space. A
   * plus-tagged address — `anna+orders@agents.com` — goes where
   * `anna@agents.com` goes unless it is assigned itself. An address that is
   * not assigned is in its domain's space, as before.
   *
   * Assigning an address that is already assigned moves it. Mail it already
   * has stays in the space it was in, with that space's suppression lists;
   * sends from it still queued or scheduled fail with `sender_unknown`, as
   * they do when a domain moves. Mail already on its way while it moves stays
   * in the space it was headed to. An agent login already connected to the
   * address stays on the old space: it keeps reading the mail there and its
   * sends are refused; connect it again for the new space. An address on no
   * domain of the workspace fails with `sender_unknown`, one on a domain that
   * has not verified with `409 domain_unverified`. An assigned address does
   * not count against the plan; the emails it sends and receives do, as any
   * email does.
   */
  assign(
    body: AssignAddressRequest,
    options?: RequestOptions
  ): APIPromise<Address> {
    return this.client.request({
      method: "POST",
      path: "/addresses",
      body,
      options,
    })
  }

  /**
   * Remove an address from its space. Removes the assignment: from its next
   * email on, the address is where its untagged address is assigned —
   * `anna@agents.com` for `anna+orders@agents.com` — else in its domain's
   * space again. Mail it already has stays in the space it was in. An address
   * that is not assigned is `404 not_found`.
   */
  remove(address: string, options?: RequestOptions): APIPromise<void> {
    return this.client.request({
      method: "DELETE",
      path: `/addresses/${pathSegment(address)}`,
      options,
    })
  }
}

/** Create and delete credentials for API access. */
export class ApiKeys extends Resource {
  /**
   * List API keys. Lists the workspace's API keys, newest first. Keys are
   * returned as metadata only — the prefix, scope, creation time, and
   * `last_used_at`; the secret itself is never readable after creation. Admin
   * only.
   */
  list(
    query: ListApiKeysQuery = {},
    options?: RequestOptions
  ): PagePromise<ApiKey> {
    return this.client.paginate({
      method: "GET",
      path: "/api-keys",
      query,
      options,
    })
  }

  /**
   * Create an API key. Creates an organization-wide API key and returns its
   * secret exactly once, in the `key` field. Store it before the response is
   * discarded — it cannot be recovered. Choose the narrowest scope the caller
   * needs: `read`, `sending`, or `full`. The key reaches the whole workspace,
   * spaces included. Admin only.
   */
  create(
    body: CreateApiKeyRequest,
    options?: RequestOptions
  ): APIPromise<ApiKeyCreated> {
    return this.client.request({
      method: "POST",
      path: "/api-keys",
      body,
      options,
    })
  }

  /**
   * Delete an API key. Deletes a key immediately. It authenticates nothing
   * afterwards and cannot be recovered; issue a new key instead. Admin only.
   */
  delete(keyId: string, options?: RequestOptions): APIPromise<void> {
    return this.client.request({
      method: "DELETE",
      path: `/api-keys/${pathSegment(keyId)}`,
      options,
    })
  }
}

/** Send, inspect, and schedule email. */
export class GeneratedEmails extends Resource {
  /**
   * Send an email. Sends an email — or, with `draft: true`, writes it for a
   * person to review and send. Requires a `from` address on a verified domain
   * or a connected mailbox, and at least one of `html` or `text`. `thread_id`
   * continues a conversation; to answer a message AI Inbx has not seen — mail
   * from before a migration, or from another provider — name it in
   * `in_reply_to` and `references` instead. Recipients on a matching
   * suppression list are dropped and reported in `suppressed`; a pacing rule
   * that holds the message is reported in `pacing`. Pass `Idempotency-Key` so
   * a retry after a timeout replays the original send instead of sending
   * twice. A workspace with no plan fails with 402 `plan_required`, and one
   * that has used its plan's emails for the month with 402
   * `allowance_reached`.
   */
  send(
    body: SendEmailRequest,
    options?: IdempotentRequestOptions
  ): APIPromise<SendEmailResponse> {
    return this.client.request({
      method: "POST",
      path: "/emails",
      body,
      idempotencyKey: options?.idempotencyKey,
      options,
    })
  }

  /**
   * List emails. Lists emails in the workspace, newest first. Filter by
   * `direction`, delivery `status`, a single `thread_id`, or a literal
   * `query`: every word in it must appear in the subject, the sender, a
   * recipient or the Message-ID, in any order and case. The query is a literal
   * filter; the API does not provide semantic email search. To sync, walk
   * forward instead: `order=asc` with `after` set to the `created_at` of the
   * last email you have lists only what is new, oldest first.
   */
  list(
    query: ListEmailsQuery = {},
    options?: RequestOptions
  ): PagePromise<Email> {
    return this.client.paginate({
      method: "GET",
      path: "/emails",
      query,
      options,
    })
  }

  /**
   * Retrieve an email. Returns one email in full: both bodies, every header,
   * attachments, the delivery event history, and tracked engagements. Pass
   * `include=attachment_content` to inline each attachment's prepared text,
   * which saves a request per attachment before handing a message to a model.
   */
  retrieve(
    emailId: string,
    query: RetrieveEmailQuery = {},
    options?: RequestOptions
  ): APIPromise<FullEmail> {
    return this.client.request({
      method: "GET",
      path: `/emails/${pathSegment(emailId)}`,
      query,
      options,
    })
  }

  /**
   * Update an email. Changes an email that has not gone out — a `draft` or a
   * `scheduled` one: its recipients, subject, bodies, attachments or send
   * time. Fields left out stay as they are. The email is composed again when
   * it goes, so what is sent is what it says by then. One that has begun
   * sending, or was canceled or discarded, returns 409 `not_scheduled`.
   */
  update(
    emailId: string,
    body: UpdateEmailRequest,
    options?: RequestOptions
  ): APIPromise<Email> {
    return this.client.request({
      method: "PATCH",
      path: `/emails/${pathSegment(emailId)}`,
      body,
      options,
    })
  }

  /**
   * Send a draft. Sends a draft: at the `scheduled_at` given, else at the
   * draft's own while it is still ahead, else now. From here it is a
   * `scheduled` email — counted against the plan, and composed again when it
   * goes. Anything but a draft returns 409 `not_draft`; a workspace out of
   * emails returns 402.
   */
  sendDraft(
    emailId: string,
    body: SendDraftRequest = {},
    options?: RequestOptions
  ): APIPromise<Email> {
    return this.client.request({
      method: "POST",
      path: `/emails/${pathSegment(emailId)}/send`,
      body,
      options,
    })
  }

  /**
   * Cancel an email. Cancels a scheduled email before it is composed and sent
   * — its status becomes `canceled` — or discards a draft, which becomes
   * `discarded`. Either is terminal: the email cannot be put back into flight.
   */
  cancel(emailId: string, options?: RequestOptions): APIPromise<Email> {
    return this.client.request({
      method: "POST",
      path: `/emails/${pathSegment(emailId)}/cancel`,
      options,
    })
  }
}

/** Read email conversations. */
export class GeneratedThreads extends Resource {
  /**
   * List threads. Lists conversations, most recently active first. Every word
   * of `query` must appear in the subject, the mailbox or a participant's
   * address, literally and in any order; `mailbox` narrows to one address.
   */
  list(
    query: ListThreadsQuery = {},
    options?: RequestOptions
  ): PagePromise<Thread> {
    return this.client.paginate({
      method: "GET",
      path: "/threads",
      query,
      options,
    })
  }

  /**
   * Retrieve a thread. Returns a thread with its messages inline, oldest
   * first. Messages paginate independently of the thread list via
   * `message_limit` and `message_cursor`, so a long conversation can be walked
   * without loading it whole.
   */
  retrieve(
    threadId: string,
    query: RetrieveThreadQuery = {},
    options?: RequestOptions
  ): APIPromise<FullThread> {
    return this.client.request({
      method: "GET",
      path: `/threads/${pathSegment(threadId)}`,
      query,
      options,
    })
  }

  /**
   * Reply in a thread. Replies within a thread. The sender, recipients,
   * subject, and the `In-Reply-To` and `References` headers are inferred from
   * the conversation, as a mail client infers them from the email answered:
   * `email_id`, or the thread's latest. The reply follows that email's
   * Reply-To; one that names only your own addresses is refused with 400
   * `no_recipients` rather than guessed around. Only the content is required —
   * set `reply_all` or the individual fields to override what is inferred.
   * Suppression and pacing behave exactly as on a send; an `Idempotency-Key`
   * is bound to the request, so a retry replays the reply even after the
   * thread has moved on. So does the plan: 402 `plan_required` without one,
   * 402 `allowance_reached` once its emails are used up.
   */
  reply(
    threadId: string,
    body: ReplyThreadRequest,
    options?: IdempotentRequestOptions
  ): APIPromise<SendEmailResponse> {
    return this.client.request({
      method: "POST",
      path: `/threads/${pathSegment(threadId)}/reply`,
      body,
      idempotencyKey: options?.idempotencyKey,
      options,
    })
  }

  /**
   * Forward a thread. Sends the whole thread as one email to recipients who
   * were not on it. Every message is rendered into one transcript, oldest
   * first, each turn as what its author wrote with quoted tails and repeated
   * signatures removed; the thread's attachments ride along unless
   * `include_attachments` is false, and `note` is placed above the transcript.
   * Only `to` is required: the sender defaults to the thread's mailbox and the
   * subject to `Fwd:` and the thread's. The forward opens a thread of its own,
   * linked back through `forward_of`, so a later reply on the original still
   * goes to its participants and replies to the forward land on the forward.
   * Suppression, pacing, scheduling, and idempotency behave exactly as on a
   * send. So does the plan: 402 `plan_required` without one, 402
   * `allowance_reached` once its emails are used up.
   */
  forward(
    threadId: string,
    body: ForwardThreadRequest,
    options?: IdempotentRequestOptions
  ): APIPromise<SendEmailResponse> {
    return this.client.request({
      method: "POST",
      path: `/threads/${pathSegment(threadId)}/forward`,
      body,
      idempotencyKey: options?.idempotencyKey,
      options,
    })
  }
}

/** Manage sending domains and DNS checks. */
export class Domains extends Resource {
  /**
   * List domains. Lists the workspace's sending domains with their
   * verification state and tracking settings.
   */
  list(
    query: ListDomainsQuery = {},
    options?: RequestOptions
  ): PagePromise<Domain> {
    return this.client.paginate({
      method: "GET",
      path: "/domains",
      query,
      options,
    })
  }

  /**
   * Create a domain. Registers a sending domain and returns the DNS records to
   * publish: SPF, DKIM, DMARC, a return path, and an MX record for receiving.
   * `region` selects the regional mail infrastructure for this domain; it can
   * be changed with `PATCH /domains/{domain_id}` until the domain is verified.
   *
   * A wildcard — `*.acme.dev` — is verified once and covers every subdomain:
   * the MX record goes at `*.acme.dev`, the rest at `acme.dev`, and the apex
   * keeps whatever mail setup it has. A name one label under a wildcard of
   * yours — `hi.acme.dev` under `*.acme.dev` — is created as a subdomain of
   * it: no records, verified as soon as the wildcard is, in whatever
   * `space_id` you give it. That is how a platform hands each customer an
   * address of their own without touching DNS again. To give customers single
   * addresses of one shared domain instead, assign each address to its
   * customer's space with `POST /addresses`.
   *
   * A domain name can be connected in several spaces and workspaces, but
   * sending and receiving are enabled for the one whose DKIM key is published.
   * To move them, add the domain where it should go and publish its DNS
   * records. The next verification check moves them; existing mail stays where
   * it was. Duplicate apex or wildcard identities within one space fail with
   * `domain_taken`.
   *
   * Every workspace already has one domain it did not add:
   * `<slug>.aiinbx.app`, listed with `provided: true`. It is verified through
   * our zone, has no records and cannot be deleted; a name under `aiinbx.app`
   * cannot be added by hand and fails with `reserved_domain`.
   *
   * A domain of its own counts against the plan's custom domains — a subdomain
   * under a wildcard and the provided domain do not. With none left the
   * request fails with 402 `allowance_reached`, and a workspace with no plan
   * with 402 `plan_required`.
   *
   * `track_opens` and `track_clicks` set the domain's `tracking`; what they
   * leave out starts as the workspace's tracking defaults in the console say —
   * off unless they are set there — or, on a subdomain, as its wildcard's.
   * Change either afterwards with `PATCH /domains/{domain_id}`.
   */
  create(
    body: CreateDomainRequest,
    options?: RequestOptions
  ): APIPromise<Domain> {
    return this.client.request({
      method: "POST",
      path: "/domains",
      body,
      options,
    })
  }

  /**
   * Retrieve a domain. Returns one domain with its DNS records and the state
   * of each — `pending`, `verified`, or `missing` — along with when each was
   * last checked.
   */
  retrieve(domainId: string, options?: RequestOptions): APIPromise<Domain> {
    return this.client.request({
      method: "GET",
      path: `/domains/${pathSegment(domainId)}`,
      options,
    })
  }

  /**
   * Update domain tracking settings. Updates whether opens and clicks are
   * tracked on mail sent from the domain. Applies to every send from it that
   * does not say otherwise in `tracking`, from the next one to leave. At least
   * one field is required.
   */
  update(
    domainId: string,
    body: UpdateDomainRequest,
    options?: RequestOptions
  ): APIPromise<Domain> {
    return this.client.request({
      method: "PATCH",
      path: `/domains/${pathSegment(domainId)}`,
      body,
      options,
    })
  }

  /**
   * Delete a domain. Deletes a domain and stops future sends from it. Remove
   * the published DNS records afterwards. A wildcard's subdomains are deleted
   * with it, in whatever space they sit; a subdomain is removed on its own,
   * with nothing to unpublish. The provided domain cannot be deleted and fails
   * with `domain_provided`.
   */
  delete(domainId: string, options?: RequestOptions): APIPromise<void> {
    return this.client.request({
      method: "DELETE",
      path: `/domains/${pathSegment(domainId)}`,
      options,
    })
  }

  /**
   * Verify domain DNS records now. Checks the domain's DNS records against
   * live DNS now. `verified_at` stays null until the sending identity’s DKIM
   * verification succeeds; inbound MX, SPF, and DMARC readiness are separate.
   * DNS propagation usually takes minutes and occasionally hours, so poll at a
   * sane interval or subscribe to the `domain.verified` webhook instead.
   * Domains are also rechecked in the background: a verified domain whose DKIM
   * record stops resolving gets `dkim_missing_since`, keeps sending, and
   * `domain.at_risk` is sent; `domain.restored` follows if the record is back,
   * and has held for an hour, by `stops_sending_at`, otherwise it loses
   * `verified_at` and `domain.lost` is sent.
   */
  verify(domainId: string, options?: RequestOptions): APIPromise<Domain> {
    return this.client.request({
      method: "POST",
      path: `/domains/${pathSegment(domainId)}/verify`,
      options,
    })
  }

  /**
   * Diagnose domain DNS configuration. Reads the domain's live DNS zone and
   * reports what is wrong with it — a duplicate SPF record, a permissive
   * policy, a missing return path. Each finding carries a severity, an
   * explanation, the fix, and the records it was drawn from. Nothing is
   * stored; the result always reflects DNS as it is right now.
   */
  diagnostics(
    domainId: string,
    options?: RequestOptions
  ): APIPromise<DnsDiagnosticsResponse> {
    return this.client.request({
      method: "GET",
      path: `/domains/${pathSegment(domainId)}/diagnostics`,
      options,
    })
  }
}

/** Connect and manage provider mailboxes. */
export class Mailboxes extends Resource {
  /**
   * List mailboxes. Lists connected Gmail and Outlook mailboxes with their
   * sync state.
   */
  list(
    query: ListMailboxesQuery = {},
    options?: RequestOptions
  ): PagePromise<Mailbox> {
    return this.client.paginate({
      method: "GET",
      path: "/mailboxes",
      query,
      options,
    })
  }

  /**
   * Create a mailbox connection URL. Creates a single-use, short-lived URL
   * that walks a customer through authorizing their Gmail or Outlook mailbox.
   * Redirect them to it rather than emailing it. Pass `ref` — your own
   * identifier — and `metadata` for anything else you want kept with the
   * mailbox; both are stored on it and carried on every `mailbox.*` webhook.
   * On a reconnect each replaces what the mailbox had, and one left out leaves
   * it alone. The `mailbox.connected` webhook — not the browser returning to
   * `return_to` — is the authoritative signal that the mailbox is live.
   * `return_to` may be any URL here, since the request is authenticated; a
   * connect link opened from a browser is held to the app's `return_urls`
   * instead. `space_id` files the mailbox in a space; the returned URL carries
   * it, so a platform mints one link per customer server-side rather than
   * handing out the bare hosted link. A workspace with no plan fails with 402
   * `plan_required`. A mailbox counts against the plan's mailboxes, but which
   * one it will be is only known once the person has authorized: with none
   * left, a mailbox the workspace does not already hold is refused then, and
   * the refusal is reported in `error` on `return_to`. Reconnecting one that
   * is `active` or `needs_reauth` takes nothing new.
   */
  connect(
    body: ConnectMailboxRequest,
    options?: RequestOptions
  ): APIPromise<ConnectMailboxResponse> {
    return this.client.request({
      method: "POST",
      path: "/mailboxes/connect",
      body,
      options,
    })
  }

  /**
   * Retrieve a mailbox. Returns one mailbox, including its `state` and the
   * provider's `state_reason` when there is one. A mailbox that is not
   * `active` cannot send.
   */
  retrieve(mailboxId: string, options?: RequestOptions): APIPromise<Mailbox> {
    return this.client.request({
      method: "GET",
      path: `/mailboxes/${pathSegment(mailboxId)}`,
      options,
    })
  }

  /**
   * Disconnect a mailbox. Disconnects a mailbox, stopping sync and dropping
   * its stored credentials. Messages already received stay on their threads.
   */
  disconnect(mailboxId: string, options?: RequestOptions): APIPromise<Mailbox> {
    return this.client.request({
      method: "DELETE",
      path: `/mailboxes/${pathSegment(mailboxId)}`,
      options,
    })
  }

  /**
   * Queue a mailbox sync. Queues a catch-up sync for a mailbox. Mail normally
   * arrives on its own through provider push notifications, so this is a
   * repair tool rather than a way to poll. Messages found surface as ordinary
   * `email.received` events.
   */
  sync(
    mailboxId: string,
    options?: RequestOptions
  ): APIPromise<MailboxSyncResponse> {
    return this.client.request({
      method: "POST",
      path: `/mailboxes/${pathSegment(mailboxId)}/sync`,
      options,
    })
  }
}

/** Manage customer-owned Google and Microsoft OAuth apps. */
export class OauthApps extends Resource {
  /**
   * List OAuth apps. Lists the workspace's own Google and Microsoft OAuth
   * apps.
   */
  list(
    query: ListOAuthAppsQuery = {},
    options?: RequestOptions
  ): PagePromise<OAuthApp> {
    return this.client.paginate({
      method: "GET",
      path: "/oauth-apps",
      query,
      options,
    })
  }

  /**
   * Create an OAuth app. Registers your own OAuth app so the mailbox consent
   * screen carries your product's name rather than AI Inbx. The response
   * returns the `redirect_uri` to register with the provider, a hosted
   * `connect_url`, and — for Google — the `push_endpoint` your own Pub/Sub
   * topic should publish to. The `slug` is claimed globally because it forms
   * the connect URL. `return_urls` lists the pages of yours a connect link
   * (`connect_url` + `/start?return_to=…`) may send a person back to; without
   * one, only the hosted page works.
   */
  create(
    body: CreateOAuthAppRequest,
    options?: RequestOptions
  ): APIPromise<OAuthApp> {
    return this.client.request({
      method: "POST",
      path: "/oauth-apps",
      body,
      options,
    })
  }

  /**
   * Retrieve an OAuth app. Returns one OAuth app. The client secret is never
   * returned.
   */
  retrieve(appId: string, options?: RequestOptions): APIPromise<OAuthApp> {
    return this.client.request({
      method: "GET",
      path: `/oauth-apps/${pathSegment(appId)}`,
      options,
    })
  }

  /**
   * Update an OAuth app. Updates an OAuth app's credentials, branding or
   * return URLs. At least one field is required. A rotated secret replaces the
   * old one immediately, so update the provider first. `return_urls` replaces
   * the whole list.
   */
  update(
    appId: string,
    body: UpdateOAuthAppRequest,
    options?: RequestOptions
  ): APIPromise<OAuthApp> {
    return this.client.request({
      method: "PATCH",
      path: `/oauth-apps/${pathSegment(appId)}`,
      body,
      options,
    })
  }

  /**
   * Delete an OAuth app. Deletes an OAuth app. Mailboxes already connected
   * through it keep working until their authorization lapses.
   */
  delete(appId: string, options?: RequestOptions): APIPromise<void> {
    return this.client.request({
      method: "DELETE",
      path: `/oauth-apps/${pathSegment(appId)}`,
      options,
    })
  }
}

/** Configure event delivery and inspect delivery attempts. */
export class WebhookEndpoints extends Resource {
  /**
   * List webhook endpoints. Lists the workspace's webhook endpoints with their
   * subscriptions and routing rules.
   */
  list(
    query: ListWebhookEndpointsQuery = {},
    options?: RequestOptions
  ): PagePromise<WebhookEndpoint> {
    return this.client.paginate({
      method: "GET",
      path: "/webhook-endpoints",
      query,
      options,
    })
  }

  /**
   * Create a webhook endpoint. Registers an organization-wide endpoint and
   * returns its signing secret exactly once, in the `secret` field: no later
   * read shows it again. A secret that was lost, or has leaked, is replaced
   * with `POST /webhook-endpoints/{endpoint_id}/rotate-secret`, which keeps
   * the old one verifying for a grace period while you deploy the new one.
   * `subscriptions` must name at least one event type. Setting `payload` to
   * `full` puts the whole email on `email.received` and `email.sent`, as
   * `data.email`, so a handler does not have to fetch it. Optional routing
   * rules narrow delivery by sender or recipient: a matching `block` rule
   * always wins, and an empty allow list means no opinion. The endpoint
   * receives every space's events, each stamped with its `space_id`.
   */
  create(
    body: WebhookEndpointRequest,
    options?: RequestOptions
  ): APIPromise<WebhookEndpointCreated> {
    return this.client.request({
      method: "POST",
      path: "/webhook-endpoints",
      body,
      options,
    })
  }

  /**
   * Retrieve a webhook endpoint. Returns one endpoint, including when a
   * rotated previous secret stops being accepted.
   */
  retrieve(
    endpointId: string,
    options?: RequestOptions
  ): APIPromise<WebhookEndpoint> {
    return this.client.request({
      method: "GET",
      path: `/webhook-endpoints/${pathSegment(endpointId)}`,
      options,
    })
  }

  /**
   * Update a webhook endpoint. Updates an endpoint's URL, subscriptions,
   * routing rules, payload, or enabled state. At least one field is required.
   * A change of `payload` applies from the next delivery attempt, retries of
   * earlier events included; a `v1` endpoint cannot be `full`. A disabled
   * endpoint receives nothing, and events that occur while it is off are not
   * queued for later.
   */
  update(
    endpointId: string,
    body: UpdateWebhookEndpointRequest,
    options?: RequestOptions
  ): APIPromise<WebhookEndpoint> {
    return this.client.request({
      method: "PATCH",
      path: `/webhook-endpoints/${pathSegment(endpointId)}`,
      body,
      options,
    })
  }

  /**
   * Delete a webhook endpoint. Deletes an endpoint. Pending deliveries to it
   * stop.
   */
  delete(endpointId: string, options?: RequestOptions): APIPromise<void> {
    return this.client.request({
      method: "DELETE",
      path: `/webhook-endpoints/${pathSegment(endpointId)}`,
      options,
    })
  }

  /**
   * Rotate a webhook signing secret. Issues a new signing secret and returns
   * it, once — the only way to get a secret after the endpoint was created.
   * The previous one keeps verifying for `grace_seconds` (a day by default, a
   * week at most): every delivery in that window is signed with both, so a
   * deployment can roll over without dropping events, and
   * `previous_secret_expires_at` says when the overlap ends. Set the grace
   * period to 0 only when a secret has leaked and the exposure matters more
   * than the gap.
   */
  rotateSecret(
    endpointId: string,
    body: RotateWebhookSecretRequest = {},
    options?: RequestOptions
  ): APIPromise<WebhookSecretResponse> {
    return this.client.request({
      method: "POST",
      path: `/webhook-endpoints/${pathSegment(endpointId)}/rotate-secret`,
      body,
      options,
    })
  }

  /**
   * Send a test webhook. Delivers a synthetic event to the endpoint and
   * reports what it actually did — status code, duration, error, and the first
   * 2 KB of its response. The test event is signed like a real one, so it
   * exercises signature verification too. `payload` is sent verbatim and does
   * not have to match the real shape for that event type. A test event is
   * about no message, so on a `full` endpoint the `data.email` of an
   * `email.received` or `email.sent` test is the `email` you put in `payload`,
   * or null.
   */
  test(
    endpointId: string,
    body: WebhookTestRequest,
    options?: RequestOptions
  ): APIPromise<WebhookTestResponse> {
    return this.client.request({
      method: "POST",
      path: `/webhook-endpoints/${pathSegment(endpointId)}/test`,
      body,
      options,
    })
  }

  /**
   * List webhook deliveries. Lists deliveries to an endpoint, filterable by
   * state. Each carries the event envelope it sends and every attempt made:
   * timestamp, status code, duration, error, and the beginning of your
   * response, which is usually what explains a rejection. `body` is what is
   * stored. For a `full` endpoint that is the envelope without `data.email`:
   * the email is read from the message each time a delivery is sent and is not
   * kept with it. It is null for a `v1` endpoint — its legacy body is built
   * from the message at send time, not stored — and for a delivery nothing was
   * sent for.
   */
  listDeliveries(
    endpointId: string,
    query: ListWebhookDeliveriesQuery = {},
    options?: RequestOptions
  ): PagePromise<WebhookDelivery> {
    return this.client.paginate({
      method: "GET",
      path: `/webhook-endpoints/${pathSegment(endpointId)}/deliveries`,
      query,
      options,
    })
  }

  /**
   * Retry webhook deliveries. Replays up to 100 deliveries. A replay carries
   * the same event `id` as the original, so a handler that deduplicates on it
   * stays correct.
   */
  retryDeliveries(
    endpointId: string,
    body: RetryDeliveriesRequest,
    options?: RequestOptions
  ): APIPromise<IdListResponse> {
    return this.client.request({
      method: "POST",
      path: `/webhook-endpoints/${pathSegment(endpointId)}/deliveries/retry`,
      body,
      options,
    })
  }
}

/**
 * Read back what happened in the workspace — the events webhooks carry,
 * whether or not an endpoint heard them.
 */
export class GeneratedEvents extends Resource {
  /**
   * List events. Lists the workspace's events, newest first — every event,
   * recorded when it happens, whether or not a webhook endpoint subscribes to
   * its type. Each is the envelope a webhook delivers, with the same `id`, so
   * a handler that deduplicates on it can read from here and from its endpoint
   * alike. Filter by `type`, repeated for any of several, or by `email_id` for
   * what happened to one email. To catch up after missed webhooks, walk
   * forward: `order=asc` with `after` set to the `created_at` of the last
   * event you processed. `data` is the summary every endpoint receives; the
   * `data.email` a `full` endpoint is sent is read when a delivery goes out
   * and not kept, so read the email by its `email_id`. Test events sent to an
   * endpoint are not listed.
   */
  list(
    query: ListEventsQuery = {},
    options?: RequestOptions
  ): PagePromise<WebhookEvent> {
    return this.client.paginate({
      method: "GET",
      path: "/events",
      query,
      options,
    })
  }

  /**
   * Retrieve an event. Returns one event by id — the `id` of the envelope a
   * webhook delivered, which is also the `AIInbx-Event-ID` header and a
   * delivery's `event_id`.
   */
  retrieve(
    eventId: string,
    options?: RequestOptions
  ): APIPromise<WebhookEvent> {
    return this.client.request({
      method: "GET",
      path: `/events/${pathSegment(eventId)}`,
      options,
    })
  }
}

/** Prevent delivery to opted-out or unsafe recipients. */
export class Suppressions extends Resource {
  /**
   * List suppressions. Lists suppression entries, filterable by list `key`,
   * `reason`, or a substring of the `address`. `blocks` and `last_blocked_at`
   * show how often each entry has actually stopped a send.
   */
  list(
    query: ListSuppressionsQuery = {},
    options?: RequestOptions
  ): PagePromise<Suppression> {
    return this.client.paginate({
      method: "GET",
      path: "/suppressions",
      query,
      options,
    })
  }

  /**
   * Create suppressions. Adds up to 1000 addresses to a suppression list.
   * `key` defaults to the workspace-wide `*` list and `scope` to `all`; a
   * `scope` of `optional` blocks only sends marked as unsubscribable, so a
   * marketing opt-out does not stop a password reset. Adding an address that
   * is already listed updates the existing entry rather than duplicating it,
   * and never narrows a wider scope. `space_id` puts the entries on a space's
   * list, which stops that space's sends alone; without it they stop every
   * space's.
   */
  add(
    body: SuppressionRequest,
    options?: RequestOptions
  ): APIPromise<SuppressionBatch> {
    return this.client.request({
      method: "POST",
      path: "/suppressions",
      body,
      options,
    })
  }

  /**
   * Retrieve a suppression. Returns one suppression entry, including how it
   * was created and how many sends it has stopped.
   */
  retrieve(
    suppressionId: string,
    options?: RequestOptions
  ): APIPromise<Suppression> {
    return this.client.request({
      method: "GET",
      path: `/suppressions/${pathSegment(suppressionId)}`,
      options,
    })
  }

  /**
   * Delete a suppression. Removes a suppression entry, allowing sends to that
   * address again. Removing a `bounce` or `complaint` entry means mailing an
   * address that already rejected you or reported you as spam — do it only
   * with specific evidence the address was fixed. `provider_suppressed` says
   * whether SES itself still refuses the address, which removing the entry
   * does not change.
   */
  remove(
    suppressionId: string,
    options?: RequestOptions
  ): APIPromise<SuppressionDeleted> {
    return this.client.request({
      method: "DELETE",
      path: `/suppressions/${pathSegment(suppressionId)}`,
      options,
    })
  }
}

/**
 * Rules that pace outgoing mail: sending hours, and caps per sender, recipient
 * or domain.
 */
export class PacingRules extends Resource {
  /**
   * List pacing rules. Lists the workspace's pacing rules, both sending-hours
   * and rate-limit kinds. Rules with `builtin: true` came with the workspace:
   * they cap mail sent from the [provided
   * domain](/guides/domains#your-provided-domain) and cannot be changed or
   * removed.
   */
  list(
    query: ListPacingRulesQuery = {},
    options?: RequestOptions
  ): PagePromise<PacingRule> {
    return this.client.paginate({
      method: "GET",
      path: "/pacing-rules",
      query,
      options,
    })
  }

  /**
   * Create a pacing rule. Creates a pacing rule. An `hours` rule holds mail
   * outside the weekly windows you declare, evaluated in the rule's own
   * timezone. A `limit` rule caps sends per rolling window against a scope —
   * the rule as a whole, or per sender address, sending domain, recipient, or
   * recipient domain. An empty `match` array applies the rule to every send.
   * `space_id` makes the rule read one space's mail alone; workspace rules
   * apply to every space and stack on top. An enabled rule counts against the
   * plan's active custom pacing rules: with none left the request fails with
   * 402 `allowance_reached`, and a workspace with no plan with 402
   * `plan_required`. A rule created with `enabled` false takes nothing until
   * it is switched on.
   */
  create(
    body: PacingRuleRequest,
    options?: RequestOptions
  ): APIPromise<PacingRule> {
    return this.client.request({
      method: "POST",
      path: "/pacing-rules",
      body,
      options,
    })
  }

  /**
   * Retrieve a pacing rule. Returns one pacing rule with its match patterns
   * and its schedule or limit.
   */
  retrieve(ruleId: string, options?: RequestOptions): APIPromise<PacingRule> {
    return this.client.request({
      method: "GET",
      path: `/pacing-rules/${pathSegment(ruleId)}`,
      options,
    })
  }

  /**
   * Update a pacing rule. Updates a pacing rule. At least one field is
   * required. Setting `enabled` to false parks a rule without losing its
   * configuration, which is the quickest way to confirm which rule is holding
   * mail. A `builtin` rule cannot be changed and fails with `rule_builtin`.
   * Setting `enabled` to true on a parked rule takes one of the plan's active
   * custom pacing rules again, and fails with 402 `allowance_reached` when
   * none is left.
   */
  update(
    ruleId: string,
    body: UpdatePacingRuleRequest,
    options?: RequestOptions
  ): APIPromise<PacingRule> {
    return this.client.request({
      method: "PATCH",
      path: `/pacing-rules/${pathSegment(ruleId)}`,
      body,
      options,
    })
  }

  /**
   * Delete a pacing rule. Deletes a pacing rule. Messages it was holding
   * become eligible to send as soon as the remaining rules allow. A `builtin`
   * rule cannot be deleted and fails with `rule_builtin`.
   */
  delete(ruleId: string, options?: RequestOptions): APIPromise<void> {
    return this.client.request({
      method: "DELETE",
      path: `/pacing-rules/${pathSegment(ruleId)}`,
      options,
    })
  }

  /**
   * Retrieve pacing spread. Returns the workspace's send-timing spread, a
   * value from 0 to 100.
   */
  retrieveSpread(options?: RequestOptions): APIPromise<PacingSpread> {
    return this.client.request({
      method: "GET",
      path: "/pacing-rules/spread",
      options,
    })
  }

  /**
   * Update pacing spread. Sets how much randomness is added to send timing. At
   * 0 a rate-limited stream goes out on a metronome; higher values vary the
   * gaps, costing a little throughput in exchange for traffic that does not
   * look machine-generated. Applies to limit rules.
   */
  updateSpread(
    body: PacingSpreadRequest,
    options?: RequestOptions
  ): APIPromise<PacingSpread> {
    return this.client.request({
      method: "PATCH",
      path: "/pacing-rules/spread",
      body,
      options,
    })
  }
}

/**
 * The mail pacing holds right now, the rule holding each, and releasing it
 * early.
 */
export class Pacing extends Resource {
  /**
   * Retrieve the pacing queue. Returns a snapshot of everything pacing is
   * currently holding: a sample of queued messages, the rules in effect, and
   * per-rule counts of how many messages each matched and how many it is
   * holding. The per-rule counts are the fastest way to identify which rule is
   * responsible.
   */
  retrieve(
    query: RetrievePacingQueueQuery = {},
    options?: RequestOptions
  ): APIPromise<PacingQueue> {
    return this.client.request({
      method: "GET",
      path: "/pacing-queue",
      query,
      options,
    })
  }

  /**
   * Release emails from the pacing queue. Releases up to 500 held emails
   * immediately. `count_toward_limits` defaults to true; setting it to false
   * means the sends do not consume rule budget, which makes the rule
   * under-count — reserve it for genuinely exceptional releases. For mail that
   * should never queue, set `pacing.skip` on the send instead.
   */
  release(
    body: PacingReleaseRequest,
    options?: RequestOptions
  ): APIPromise<IdListResponse> {
    return this.client.request({
      method: "POST",
      path: "/pacing-queue/release",
      body,
      options,
    })
  }
}

/**
 * The workspace a request acts in: its name, and the defaults new domains
 * start with.
 */
export class Workspaces extends Resource {
  /**
   * List workspaces. Lists the workspaces the caller can act in, with its role
   * in each. An API key reaches its own workspace alone. An OAuth token
   * reaches every workspace it was granted, and a request with one that
   * reaches several names the workspace it acts in with the `AIInbx-Workspace`
   * header, set to an `id` from here; this list is the one call that needs no
   * header. `mode` says whether the caller acts as the whole of its workspaces
   * or as an inbox; a token connected as an inbox reaches the workspaces of
   * its inboxes, and `inboxes` names the addresses it reads and sends as.
   */
  list(options?: RequestOptions): APIPromise<WorkspaceList> {
    return this.client.request({ method: "GET", path: "/workspaces", options })
  }

  /**
   * Retrieve the workspace. Returns the workspace the request acts in: its
   * name, its slug, the tracking defaults a domain added from now on starts
   * with, and whether mail outside spaces threads across addresses.
   */
  retrieve(options?: RequestOptions): APIPromise<Workspace> {
    return this.client.request({ method: "GET", path: "/workspace", options })
  }

  /**
   * Update the workspace. Renames the workspace, changes its tracking defaults
   * or switches `thread_across_addresses` for mail outside spaces; only the
   * fields given change. A new name brings a new slug, which moves the console
   * URLs with it (the provided domain keeps its name), so a workspace can be
   * renamed once a month — sooner fails with 409 `rename_cooldown`. Tracking
   * defaults apply to domains added from now on; each existing domain keeps
   * its own. Admin only.
   */
  update(
    body: UpdateWorkspaceRequest,
    options?: RequestOptions
  ): APIPromise<Workspace> {
    return this.client.request({
      method: "PATCH",
      path: "/workspace",
      body,
      options,
    })
  }
}

/** Who is in the workspace and what each of them may do. Admin only. */
export class Members extends Resource {
  /**
   * List members. Lists everyone in the workspace, earliest to join first,
   * with their role and when they were last active. A workspace holds at most
   * 100 members, so the list is never paged. Admin only.
   */
  list(options?: RequestOptions): APIPromise<MemberList> {
    return this.client.request({ method: "GET", path: "/members", options })
  }

  /**
   * Update a member. Changes what a member may do: `admin` manages the
   * workspace, its members and its keys; `member` works with mail. It takes
   * effect on their next request. The owner's role is not changed here — 409
   * `owner_protected` — the workspace changes hands by a transfer, in the
   * console. Admin only.
   */
  update(
    memberId: string,
    body: UpdateMemberRequest,
    options?: RequestOptions
  ): APIPromise<Member> {
    return this.client.request({
      method: "PATCH",
      path: `/members/${pathSegment(memberId)}`,
      body,
      options,
    })
  }

  /**
   * Remove a member. Takes a member's access away at once. The mail they sent
   * and the API keys they created stay with the workspace. The owner cannot be
   * removed (409 `owner_protected`). Admin only.
   */
  remove(memberId: string, options?: RequestOptions): APIPromise<void> {
    return this.client.request({
      method: "DELETE",
      path: `/members/${pathSegment(memberId)}`,
      options,
    })
  }
}

/** Invitations to join the workspace, waiting to be accepted. Admin only. */
export class Invitations extends Resource {
  /**
   * List invitations. Lists the invitations nobody has answered, newest first
   * — lapsed ones too, past their `expires_at`: those can no longer be
   * accepted, and inviting the address again sends a fresh one. Admin only.
   */
  list(options?: RequestOptions): APIPromise<InvitationList> {
    return this.client.request({ method: "GET", path: "/invitations", options })
  }

  /**
   * Invite someone. Mails an invitation to join the workspace, with a link
   * that is good for seven days. Inviting an address that already has one
   * waiting replaces it once the new mail has gone — the earlier link then
   * stops working — which is also how an invitation is sent again. An address
   * that is already a member fails with 409 `already_member`. When the mail
   * cannot go, nothing is created and any earlier invitation keeps working:
   * the address has been invited too often today, or the inviter has sent too
   * many, fails with 429 `invitation_not_sent` — try again later; an address
   * that asked not to hear from us fails with 400 `recipients_suppressed`,
   * which will not change on retrying. Invitations sent with an API key are in
   * the name of the person who created the key, or the owner once they are
   * gone. Admin only.
   */
  create(
    body: CreateInvitationRequest,
    options?: RequestOptions
  ): APIPromise<Invitation> {
    return this.client.request({
      method: "POST",
      path: "/invitations",
      body,
      options,
    })
  }

  /**
   * Cancel an invitation. Cancels an invitation that is waiting to be
   * accepted; the link in the mail stops working. Send a new one if they still
   * need it. Admin only.
   */
  cancel(invitationId: string, options?: RequestOptions): APIPromise<void> {
    return this.client.request({
      method: "DELETE",
      path: `/invitations/${pathSegment(invitationId)}`,
      options,
    })
  }
}

/** Download original and prepared attachment content. */
export class Attachments extends Resource {
  /**
   * Download an attachment. Redirects to a short-lived signed URL for the
   * attachment's original bytes. Follow the redirect; the signed URL expires,
   * so resolve it on demand rather than storing it.
   */
  download(
    attachmentId: string,
    options?: RequestOptions
  ): APIPromise<ArrayBuffer> {
    return this.client.request({
      method: "GET",
      path: `/attachments/${pathSegment(attachmentId)}`,
      options,
      responseType: "arrayBuffer",
    })
  }

  /**
   * Inspect attachment metadata. Returns the attachment's media type, size,
   * and filename disposition in response headers without transferring the file
   * — the cheap way to check a size before committing to a download.
   */
  inspect(attachmentId: string, options?: RequestOptions): APIPromise<void> {
    return this.client.request({
      method: "HEAD",
      path: `/attachments/${pathSegment(attachmentId)}`,
      options,
    })
  }

  /**
   * Download prepared attachment text. Redirects to a short-lived signed URL
   * for the attachment's prepared text — Markdown where the document has
   * structure, plain text otherwise. Returns 404 `not_prepared` when the file
   * type has no text to extract or preparation failed.
   */
  content(attachmentId: string, options?: RequestOptions): APIPromise<string> {
    return this.client.request({
      method: "GET",
      path: `/attachments/${pathSegment(attachmentId)}/content`,
      options,
      responseType: "text",
    })
  }
}
