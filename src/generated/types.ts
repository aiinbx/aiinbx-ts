// Generated from @workspace/api-contract by `bun run sdk:generate`. Do not edit.

import type { Page } from "../core.js"

export type ApiKeyScope = "full" | "sending" | "read"

export type MailRegion = "eu-central-1" | "us-east-1"

export type MailboxProvider = "google" | "microsoft"

export type MailboxState = "active" | "needs_reauth" | "disconnected"

export type EmailDirection = "inbound" | "outbound"

export type EmailStatus =
  | "draft"
  | "scheduled"
  | "canceled"
  | "discarded"
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "bounced"
  | "complained"
  | "failed"
  | "received"

export type EmailCategory =
  | "human"
  | "out_of_office"
  | "auto_reply"
  | "bounce"
  | "verification"
  | "transactional"
  | "notification"
  | "marketing"
  | "spam"

export interface EmailAddress {
  name?: string | null
  address: string
}

export interface EmailHeader {
  name: string
  value: string
}

/**
 * Set on an email written as a draft — also after it is sent, so a sent email
 * says whether a person approved and changed it.
 */
export interface EmailDraft {
  drafted_at: string
  /**
   * When its content last changed before it was sent. Null when it went as
   * written.
   */
  edited_at: string | null
  /** Where a person reviews, edits and sends it in the console. */
  review_url: string | null
}

export interface BodySegment {
  kind: "written" | "quoted" | "signature"
  text: string
}

export interface Attachment {
  id: string
  filename: string
  content_type: string
  size: number
  cid: string | null
  /**
   * Signed URL for the original bytes, good until `expires_at`. Opens without
   * the API key, so treat it as a secret — and do not send the key to it:
   * storage answers a request that carries an `Authorization` header with 400.
   * To keep a reference, store the attachment `id` and call `GET
   * /attachments/{id}`. Null when the bytes are gone.
   */
  download_url: string | null
  /**
   * When `download_url` and `preparation.content_url` stop working — an hour
   * after the response. Read the email again, or call the download endpoint with
   * the attachment ID, for fresh ones.
   */
  expires_at: string | null
  preparation: AttachmentPreparation | null
}

export interface AttachmentPreparation {
  status: "ready" | "partial" | "unsupported" | "failed"
  format: "markdown" | "text" | null
  pages: number | null
  warnings: string[]
  /**
   * Signed URL for the prepared text, good until the attachment's `expires_at`.
   * Opens without the API key — and only without it: storage answers a request
   * that carries an `Authorization` header with 400. Null when there is no
   * prepared text.
   */
  content_url: string | null
  text?: string | null
}

export interface DeliveryEvent {
  id: string
  /**
   * What happened. `rejected`: the mail provider refused the message outright —
   * a virus, say — and nothing was sent; `detail` says why. The email then
   * fails, as on `failed`.
   */
  type:
    | "drafted"
    | "edited"
    | "scheduled"
    | "canceled"
    | "discarded"
    | "queued"
    | "replayed"
    | "sent"
    | "delivered"
    | "deferred"
    | "bounced"
    | "complained"
    | "rejected"
    | "failed"
  at: string
  recipient: string | null
  detail: string | null
}

export interface Engagement {
  kind: "open" | "click"
  at: string
  url: string | null
  user_agent: string | null
  /**
   * True when a proxy, security scanner or script made the hit rather than the
   * recipient.
   */
  bot: boolean
  /**
   * Why: `privacy_proxy` is Apple Mail Privacy Protection fetching on arrival,
   * `script` an HTTP library, `known_bot` a scanner or link expander that names
   * itself, `stale_browser` a browser build nobody runs any more, `too_fast`
   * within seconds of delivery, sooner than a person could act. Null when `bot`
   * is false. More reasons may be added; treat one you do not know as a bot.
   */
  bot_reason:
    | "privacy_proxy"
    | "script"
    | "known_bot"
    | "stale_browser"
    | "too_fast"
    | null
}

export interface PacingHoldReady {
  kind: "ready"
}

export interface PacingHoldHours {
  kind: "hours"
  rule_id: string
}

export interface PacingHoldLimit {
  kind: "limit"
  rule_id: string
}

export type PacingHold = PacingHoldReady | PacingHoldHours | PacingHoldLimit

export interface EmailPacing {
  held_by: PacingHold
  estimated_send_at: string | null
}

export interface DnsRecord {
  purpose: "SPF" | "DKIM" | "DMARC" | "RETURN_PATH" | "INBOUND"
  type: "MX" | "TXT" | "CNAME"
  name: string
  value: string
  ttl: number
  state: "pending" | "verified" | "missing"
  last_checked_at: string | null
}

export interface DnsFinding {
  id: string
  severity: "breaking" | "risk" | "tip"
  when: "adding" | "added" | "both"
  purpose?: "SPF" | "DKIM" | "DMARC" | "RETURN_PATH" | "INBOUND"
  title: string
  detail: string
  fix: string
  evidence: string[]
}

export interface DomainTracking {
  opens: boolean
  clicks: boolean
}

export type WebhookEventType =
  | "email.received"
  | "email.sent"
  | "email.delivered"
  | "email.bounced"
  | "email.complained"
  | "email.failed"
  | "email.unsubscribed"
  | "email.opened"
  | "email.clicked"
  | "thread.created"
  | "domain.verified"
  | "domain.at_risk"
  | "domain.restored"
  | "domain.lost"
  | "mailbox.connected"
  | "mailbox.needs_reauth"
  | "mailbox.disconnected"

export interface WebhookRoutingRule {
  effect: "allow" | "block"
  field: "from" | "to" | "either"
  pattern: string
}

/**
 * An attachment's metadata. Its content is on the email, or in `data.email`
 * for a `full` endpoint.
 */
export interface EventAttachment {
  id: string
  filename: string
  content_type: string
  size: number
  preparation: "ready" | "partial" | "unsupported" | "failed"
}

/**
 * What the receiving side thought of the message. Null when it did not say:
 * mail that arrived through a connected mailbox, and mail you sent — unless it
 * was addressed to a domain of yours and came back in.
 */
export interface EmailVerdicts {
  /**
   * `PASS`, `FAIL`, `GRAY` or `PROCESSING_FAILED`. Null when this check was not
   * reported.
   */
  spam: string | null
  /**
   * `PASS`, `FAIL`, `GRAY` or `PROCESSING_FAILED`. Null when this check was not
   * reported.
   */
  spf: string | null
  /**
   * `PASS`, `FAIL`, `GRAY` or `PROCESSING_FAILED`. Null when this check was not
   * reported.
   */
  dkim: string | null
  /**
   * `PASS`, `FAIL`, `GRAY` or `PROCESSING_FAILED`. Null when this check was not
   * reported.
   */
  dmarc: string | null
}

/**
 * On a `verification` email: the code and the link it asks the recipient to
 * use. Null on every other category, and when it carries neither.
 */
export interface EmailVerification {
  /**
   * The one-time code to type in, as the email writes it: `482913`, `482 913`,
   * `G-482913`. Null when it gives none.
   */
  code: string | null
  /**
   * The link that verifies, confirms, signs in or resets, exactly as the email
   * links it. Null when it has none.
   */
  link: string | null
}

/**
 * On an `out_of_office` or `auto_reply` email that says its sender cannot be
 * reached: why, the day they are back, and who to write to instead. Null
 * otherwise — a ticket acknowledgement, a thank-you.
 */
export interface EmailUnavailable {
  /**
   * `absent`: away for now — holiday, leave, travel. `left`: no longer at this
   * address. `unmonitored`: nobody reads it. More reasons may be added; treat
   * one you do not know as unreachable.
   */
  reason: "absent" | "left" | "unmonitored"
  /**
   * The first day the sender is back, when the reply says. A reply away "until"
   * a day is read as back the next working day. Null when it names no day, when
   * that day had already passed when the reply arrived, and for `left` and
   * `unmonitored`.
   */
  back_on: string | null
  /**
   * Addresses the reply says to write to instead — a colleague, a team inbox.
   * Empty when it names none.
   */
  contacts: string[]
}

export interface EmailReceivedEventData {
  /** The email, `eml_…`. Retrieve it for bodies and headers. */
  email_id: string
  /** The RFC Message-ID, without angle brackets. */
  message_id: string
  /** The conversation it belongs to. */
  thread_id: string
  /**
   * The domain the message went through: received on or sent from. Null when it
   * went through a mailbox.
   */
  domain_id: string | null
  /**
   * The mailbox the message went through: synced from or sent with. Null when it
   * went through a domain.
   */
  mailbox_id: string | null
  /** The sender. */
  from: string
  /**
   * The addresses in the To header, as written by the sender. The email has `cc`
   * and `bcc`.
   */
  to: string[]
  /** The subject line. */
  subject: string
  /** A short preview of the body. */
  snippet: string
  attachments?: EventAttachment[]
  /**
   * Only on an endpoint whose `payload` is `full`: the email, exactly as `GET
   * /emails/{id}?include=attachment_content` returns it. Read when the delivery
   * is sent, so a retry carries freshly signed URLs. Null when it could not be
   * included — the message no longer exists, or the body would pass 4 MB with
   * it; read the email by `email_id` instead.
   */
  email?: FullEmail | null
  /**
   * The addresses of yours the email arrived at: the receiving server's
   * recipients on a domain, the mailbox and its aliases the mail is written to
   * on a connected mailbox. Whatever the headers say, so an address in Cc or Bcc
   * is here. Route on it. When the same email reaches another address of yours
   * later, the event is sent again with the same `email_id` and only the new
   * addresses.
   */
  delivered_to: string[]
  /**
   * What kind of mail it is. Gate automated replies on `human`, or an
   * autoresponder and your agent answer each other.
   */
  category: EmailCategory | null
  verdicts: EmailVerdicts | null
  verification: EmailVerification | null
  unavailable: EmailUnavailable | null
}

export interface EmailSentEventData {
  /** The email, `eml_…`. Retrieve it for bodies and headers. */
  email_id: string
  /** The RFC Message-ID, without angle brackets. */
  message_id: string
  /** The conversation it belongs to. */
  thread_id: string
  /**
   * The domain the message went through: received on or sent from. Null when it
   * went through a mailbox.
   */
  domain_id: string | null
  /**
   * The mailbox the message went through: synced from or sent with. Null when it
   * went through a domain.
   */
  mailbox_id: string | null
  /** The sender. */
  from: string
  /**
   * The addresses in the To header, as written by the sender. The email has `cc`
   * and `bcc`.
   */
  to: string[]
  /** The subject line. */
  subject: string
  /** A short preview of the body. */
  snippet: string
  attachments?: EventAttachment[]
  /**
   * Only on an endpoint whose `payload` is `full`: the email, exactly as `GET
   * /emails/{id}?include=attachment_content` returns it. Read when the delivery
   * is sent, so a retry carries freshly signed URLs. Null when it could not be
   * included — the message no longer exists, or the body would pass 4 MB with
   * it; read the email by `email_id` instead.
   */
  email?: FullEmail | null
  /** The suppression list the send named, when it named one. */
  suppression_key: string | null
}

export interface EmailDeliveredEventData {
  /** The email, `eml_…`. Retrieve it for bodies and headers. */
  email_id: string
  /** The RFC Message-ID, without angle brackets. */
  message_id: string
  /** The conversation it belongs to. */
  thread_id: string
  /**
   * The domain the message went through: received on or sent from. Null when it
   * went through a mailbox.
   */
  domain_id: string | null
  /**
   * The mailbox the message went through: synced from or sent with. Null when it
   * went through a domain.
   */
  mailbox_id: string | null
  /** The suppression list the send named, when it named one. */
  suppression_key: string | null
  /** Which recipients this event covers: delivery is reported per recipient. */
  recipients: string[]
}

/**
 * Why the mail did not arrive. `bad_address`: the address does not exist or no
 * longer takes mail. `mailbox_full`: it exists and is over its quota.
 * `sender_auth`: the receiving side would not take it as from the sending
 * domain — DMARC, SPF or DKIM failed — which is fixed in the domain's DNS
 * records. `blocked`: refused by the receiving side's policy — a blocklist,
 * the sender's reputation, a recipient that only takes mail from some senders.
 * `content`: the message itself — its content, an attachment, its size.
 * `expired`: retried until the provider gave up. `routing`: no route to the
 * recipient, a loop. `unknown`: none of these could be read from what was
 * said. More causes may be added; treat one you do not know as `unknown`.
 */
export type BounceCause =
  | "bad_address"
  | "mailbox_full"
  | "sender_auth"
  | "blocked"
  | "content"
  | "expired"
  | "routing"
  | "unknown"

export interface EmailBounce {
  address: string
  cause: BounceCause
  /**
   * True when the address is dead and went on the workspace's `*` suppression
   * list, so the next send to it never leaves. Only a hard bounce of a
   * `bad_address`, or one nothing explains, is. Not SES refusing the send off
   * its own suppression list: that reports `bad_address` without suppressing.
   */
  suppressed: boolean
}

export interface EmailBouncedEventData {
  /** The email, `eml_…`. Retrieve it for bodies and headers. */
  email_id: string
  /** The RFC Message-ID, without angle brackets. */
  message_id: string
  /** The conversation it belongs to. */
  thread_id: string
  /**
   * The domain the message went through: received on or sent from. Null when it
   * went through a mailbox.
   */
  domain_id: string | null
  /**
   * The mailbox the message went through: synced from or sent with. Null when it
   * went through a domain.
   */
  mailbox_id: string | null
  /** The suppression list the send named, when it named one. */
  suppression_key: string | null
  /**
   * Which recipients bounced: the message did not reach them, and nothing will
   * try again.
   */
  recipients: string[]
  /**
   * One entry per address in `recipients`, in the same order: why it bounced,
   * and whether it was suppressed. Absent from an event recorded before this
   * field existed, which `GET /events` and a replay still return as it was.
   */
  bounces?: EmailBounce[]
  /**
   * True when the provider classed the bounce as hard — it gave up for good, as
   * SES's `Permanent` or a 5.x status says. False for a soft one, which the
   * provider also stopped retrying. Not whether the address is dead: a hard
   * bounce can be a blocklist or the sender's own DMARC. Read `bounces` for
   * that.
   */
  permanent: boolean
  /**
   * The provider's classification: `Permanent/General` from SES, the status
   * (`5.1.1`) from a delivery report.
   */
  reason: string
}

export interface EmailComplainedEventData {
  /** The email, `eml_…`. Retrieve it for bodies and headers. */
  email_id: string
  /** The RFC Message-ID, without angle brackets. */
  message_id: string
  /** The conversation it belongs to. */
  thread_id: string
  /**
   * The domain the message went through: received on or sent from. Null when it
   * went through a mailbox.
   */
  domain_id: string | null
  /**
   * The mailbox the message went through: synced from or sent with. Null when it
   * went through a domain.
   */
  mailbox_id: string | null
  /**
   * The suppression list the send named: where the complaint is filed, in the
   * send's space.
   */
  suppression_key: string | null
  /** Who complained. */
  recipients: string[]
  /** The provider's reason, when it gave one. */
  reason: string | null
}

export interface EmailUnsubscribedEventData {
  /** The message they opted out from, `eml_…`. */
  email_id: string
  /** The RFC Message-ID, without angle brackets. Null once the message is gone. */
  message_id: string | null
  /**
   * The domain the message went through: received on or sent from. Null when it
   * went through a mailbox.
   */
  domain_id: string | null
  /**
   * The mailbox the message went through: synced from or sent with. Null when it
   * went through a domain.
   */
  mailbox_id: string | null
  /** Who opted out. */
  address: string
  /**
   * The suppression list. `*` is the whole workspace's, or the whole space's
   * when the send was from one.
   */
  key: string
  /** Whether they blocked everything (`all`) or only optional mail (`optional`). */
  scope: SuppressionScope
  /**
   * How: the unsubscribe link, the mail client's one-click header, or a reply
   * that read as an opt-out.
   */
  source: "link" | "one_click" | "reply"
}

export interface EmailFailedEventData {
  /** The email, `eml_…`. Retrieve it for bodies and headers. */
  email_id: string
  /** The RFC Message-ID, without angle brackets. */
  message_id: string
  /** The conversation it belongs to. */
  thread_id: string
  /**
   * The domain the message went through: received on or sent from. Null when it
   * went through a mailbox.
   */
  domain_id: string | null
  /**
   * The mailbox the message went through: synced from or sent with. Null when it
   * went through a domain.
   */
  mailbox_id: string | null
  /** The suppression list the send named, when it named one. */
  suppression_key: string | null
  /** What the provider said: why the message never went out. */
  reason: string
}

export interface EmailOpenedEventData {
  /** The email, `eml_…`. Retrieve it for bodies and headers. */
  email_id: string
  /** The RFC Message-ID, without angle brackets. */
  message_id: string
  /** The conversation it belongs to. */
  thread_id: string
  /**
   * The domain the message went through: received on or sent from. Null when it
   * went through a mailbox.
   */
  domain_id: string | null
  /**
   * The mailbox the message went through: synced from or sent with. Null when it
   * went through a domain.
   */
  mailbox_id: string | null
  /** The suppression list the send named, when it named one. */
  suppression_key: string | null
  /** The client that loaded the tracking pixel. */
  user_agent: string | null
  /**
   * True when a proxy, security scanner or script made the hit rather than the
   * recipient.
   */
  bot: boolean
  /**
   * Why: `privacy_proxy` is Apple Mail Privacy Protection fetching on arrival,
   * `script` an HTTP library, `known_bot` a scanner or link expander that names
   * itself, `stale_browser` a browser build nobody runs any more, `too_fast`
   * within seconds of delivery, sooner than a person could act. Null when `bot`
   * is false. More reasons may be added; treat one you do not know as a bot.
   */
  bot_reason:
    | "privacy_proxy"
    | "script"
    | "known_bot"
    | "stale_browser"
    | "too_fast"
    | null
}

export interface EmailClickedEventData {
  /** The email, `eml_…`. Retrieve it for bodies and headers. */
  email_id: string
  /** The RFC Message-ID, without angle brackets. */
  message_id: string
  /** The conversation it belongs to. */
  thread_id: string
  /**
   * The domain the message went through: received on or sent from. Null when it
   * went through a mailbox.
   */
  domain_id: string | null
  /**
   * The mailbox the message went through: synced from or sent with. Null when it
   * went through a domain.
   */
  mailbox_id: string | null
  /** The suppression list the send named, when it named one. */
  suppression_key: string | null
  /** The destination that was clicked. */
  url: string
  /** The client that followed the link. */
  user_agent: string | null
  /**
   * True when a proxy, security scanner or script made the hit rather than the
   * recipient.
   */
  bot: boolean
  /**
   * Why: `privacy_proxy` is Apple Mail Privacy Protection fetching on arrival,
   * `script` an HTTP library, `known_bot` a scanner or link expander that names
   * itself, `stale_browser` a browser build nobody runs any more, `too_fast`
   * within seconds of delivery, sooner than a person could act. Null when `bot`
   * is false. More reasons may be added; treat one you do not know as a bot.
   */
  bot_reason:
    | "privacy_proxy"
    | "script"
    | "known_bot"
    | "stale_browser"
    | "too_fast"
    | null
}

export interface ThreadCreatedEventData {
  /** The new conversation, `thr_…`. */
  thread_id: string
  /** The opening subject. */
  subject: string
  /** The address on your side. */
  mailbox: string
  /** Set when a forward opened the thread: the conversation it carries. */
  forward_of: string | null
}

export interface DomainEventData {
  /** The domain, `dom_…`. */
  domain_id: string
  /** The domain name. */
  name: string
  /** The region it sends and receives in. */
  region: MailRegion
}

export interface DomainAtRiskEventData {
  /** The domain, `dom_…`. */
  domain_id: string
  /** The domain name. */
  name: string
  /** The region it sends and receives in. */
  region: MailRegion
  /**
   * When the domain's DKIM record was found missing from DNS. The domain keeps
   * sending meanwhile.
   */
  dkim_missing_since: string
  /**
   * When the domain is lost if the DKIM record is not restored: 72 hours after
   * `dkim_missing_since`. Then `verified_at` goes null and `domain.lost` is
   * sent.
   */
  stops_sending_at: string
}

export interface MailboxConnectedEventData {
  /** The mailbox, `mbx_…`. */
  mailbox_id: string
  /** The mailbox address. */
  address: string
  /** Which provider hosts the mailbox. */
  provider: MailboxProvider
  /**
   * The mailbox's `ref`: what you put on the connect link or passed to
   * `mailboxes.connect`. How you match the mailbox to your user.
   */
  ref: string | null
  /**
   * Your own key-value pairs, stored and given back as they are. Up to 50 keys;
   * a key is 1–40 characters, a value up to 500. Written whole: what you send
   * replaces what was there.
   */
  metadata: Record<string, string>
  /** The OAuth app of yours the mailbox was connected through. */
  app_id: string | null
  /**
   * True when this replaced an existing authorization rather than adding a new
   * mailbox.
   */
  reconnected: boolean
}

export interface MailboxStateEventData {
  /** The mailbox, `mbx_…`. */
  mailbox_id: string
  /** The mailbox address. */
  address: string
  /** Which provider hosts the mailbox. */
  provider: MailboxProvider
  /**
   * The mailbox's `ref`: what you put on the connect link or passed to
   * `mailboxes.connect`. How you match the mailbox to your user.
   */
  ref: string | null
  /**
   * Your own key-value pairs, stored and given back as they are. Up to 50 keys;
   * a key is 1–40 characters, a value up to 500. Written whole: what you send
   * replaces what was there.
   */
  metadata: Record<string, string>
  /** What the provider said, when it said anything. */
  reason: string | null
}

export interface WebhookAttempt {
  id: string
  attempted_at: string
  status_code: number | null
  duration_ms: number
  error: string | null
  response: string | null
}

export type DeliveryState = "pending" | "delivered" | "failed"

export type SuppressionReason =
  "complaint" | "bounce" | "unsubscribe" | "manual"

export type SuppressionScope = "all" | "optional"

export interface PacingMatch {
  field: "from" | "to" | "either"
  pattern: string
}

export interface PacingWindow {
  /** Weekdays the window opens on: 0 = Monday … 6 = Sunday. */
  days: number[]
  start_minute: number
  end_minute: number
}

export interface PacingJitter {
  open_early_minutes: number
  open_late_minutes: number
  close_early_minutes: number
  close_late_minutes: number
}

export interface PacingSchedule {
  timezone: string
  windows: PacingWindow[]
  jitter?: PacingJitter
}

export interface PacingScheduleState {
  timezone: string
  windows: PacingWindow[]
  jitter: PacingJitter
}

export interface PacingLimit {
  scope: "rule" | "from_address" | "from_domain" | "to_address" | "to_domain"
  amount: number
  per_seconds: number
}

export interface PacingQueueItem {
  email_id: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  from: string
  to: string[]
  subject: string
  queued_at: string
}

export interface PacingRuleCount {
  rule_id: string
  matches: number
  held: number
}

/**
 * An address of the workspace an OAuth connection acts as, in place of the
 * whole workspace: it reads the threads filed under the address or that the
 * address took part in, and sends, replies and forwards only as it.
 */
export interface Inbox {
  id: string
  /** The address it reads and sends as. */
  address: string
  /** The name its mail goes out under, when one was given. */
  name: string | null
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
}

/**
 * What the caller acts as: `inbox` for an OAuth connection made an inbox on
 * the consent page, held to the addresses in each workspace's `inboxes`;
 * `workspace` for one to the whole of its workspaces, and for an API key.
 */
export type ConnectionMode = "workspace" | "inbox"

export type WorkspaceRole = "owner" | "admin" | "member"

/**
 * Owner is never given here: the workspace changes hands by a transfer, in the
 * console.
 */
export type MemberRole = "admin" | "member"

export interface SenderObject {
  name?: string
  address: string
}

export type Sender = string | SenderObject

export interface AttachmentInput {
  filename: string
  content_type: string
  content: string
  cid?: string
}

/**
 * The send's say over pacing: `skip: true` goes past every rule, `count:
 * false` uses up none of their limits.
 */
export interface SendPacing {
  skip?: boolean
  count?: boolean
}

/**
 * Overrides the sending domain's tracking settings for this email. Only mail
 * sent from a domain is tracked: `true` on a send from a connected mailbox is
 * refused with `tracking_unavailable`.
 */
export interface SendTracking {
  /**
   * Whether opens are tracked on this email. Omit to follow the domain's
   * `tracking.opens`.
   */
  opens?: boolean
  /**
   * Whether links are rewritten to track clicks on this email. Omit to follow
   * the domain's `tracking.clicks`.
   */
  clicks?: boolean
}

export interface CreateSpaceRequest {
  /** The space's name. */
  name: string
  /** Your own id for the customer the space stands for. Unique per workspace. */
  external_id?: string
}

export interface UpdateSpaceRequest {
  /** The space's name. */
  name?: string
  /** Null clears it. */
  external_id?: string | null
}

export interface CreateApiKeyRequest {
  /** What the key is for, as the console lists it. */
  name: string
  /**
   * What the key may do: `read`, `sending`, or `full`. Pick the narrowest that
   * works.
   */
  scope?: ApiKeyScope
}

export interface SendEmailRequest {
  /**
   * The sender, `you@yourdomain.com` or `Name <you@yourdomain.com>`, on a
   * verified domain or a connected mailbox. Required, except from a connection
   * made an inbox: left out, it sends as its inbox on the thread in `thread_id`
   * — the one mail on the thread last went through, on a tie the one the thread
   * is filed under — or as its only one. With several and none of them on the
   * thread, it has to be named.
   */
  from?: Sender
  /** Recipients: one address or a list, at most 100. */
  to: string | string[]
  /** The subject line. */
  subject: string
  /**
   * Continue this thread: the email answers its latest message, and
   * `In-Reply-To` and `References` are written from it.
   */
  thread_id?: string
  /**
   * The Message-ID this email answers, with or without angle brackets — for a
   * reply to a message AI Inbx may never have seen. When it names an email of
   * yours the send joins that thread; otherwise it opens one. Not with
   * `thread_id`.
   */
  in_reply_to?: string
  /**
   * The Message-IDs of the conversation so far, oldest first, written as
   * `References`. `in_reply_to` is added at the end when it is not already
   * there, and stands alone when this is left out. Not with `thread_id`.
   */
  references?: string[]
  /** Cc recipients: one address or a list, at most 100. */
  cc?: string | string[]
  /** Bcc recipients, hidden from the others: one address or a list, at most 100. */
  bcc?: string | string[]
  /**
   * Where replies go (Reply-To), when not to the sender: one address or a list,
   * at most 100.
   */
  reply_to?: string | string[]
  /**
   * Files to attach, at most 20 and 3 MB decoded in total: `filename`,
   * `content_type` and `content` in base64, and a `cid` to make one an inline
   * image.
   */
  attachments?: AttachmentInput[]
  /**
   * Extra headers to write on the message. `Message-ID`, `In-Reply-To` and
   * `References` are the API's to write and are refused.
   */
  headers?: Record<string, string>
  /**
   * The suppression list the send is checked against, besides the workspace-wide
   * `*` list.
   */
  suppression_key?: string
  pacing?: SendPacing
  tracking?: SendTracking
  /**
   * When to send, as an ISO 8601 time, at most 30 days out. On a draft, the time
   * proposed for it.
   */
  scheduled_at?: string
  /**
   * Keep it as a draft for a person to review: nothing is sent until it is sent
   * with `POST /emails/{id}/send` or from the console, at `draft.review_url`. A
   * draft uses none of the plan's emails until then.
   */
  draft?: boolean
  /** The HTML body. */
  html?: string
  /** The plain-text body. */
  text?: string
  /**
   * Marks the email non-essential: it carries one-click unsubscribe headers, and
   * `optional` suppressions apply to it. One recipient only.
   */
  unsubscribe?: boolean
}

export interface UpdateEmailRequest {
  /** Recipients: one address or a list, at most 100. */
  to?: string | string[]
  /** Cc recipients: one address or a list, at most 100. An empty list clears it. */
  cc?: string | string[]
  /** Bcc recipients: one address or a list, at most 100. An empty list clears it. */
  bcc?: string | string[]
  /**
   * Where replies go (Reply-To): one address or a list, at most 100. An empty
   * list clears it.
   */
  reply_to?: string | string[]
  /** The subject line. */
  subject?: string
  /**
   * The HTML body. Null drops it, leaving the text. The text part is not
   * rewritten from it — send `text` too to keep the two alike.
   */
  html?: string | null
  /** The plain-text body. Null drops it, leaving the HTML. */
  text?: string | null
  /**
   * The files it carries from now on: `{ id }` keeps one it has, a new one is
   * given as on send. Left out, they stay; an empty list removes them all. New
   * files decode to at most 3 MB per request, and all the email carries to at
   * most 7 MB.
   */
  attachments?: (
    | AttachmentInput
    | {
        /** An attachment this email has. */
        id: string
      }
  )[]
  /**
   * The new send time, at most 30 days out — on a draft, the time proposed for
   * it.
   */
  scheduled_at?: string
}

export interface SendDraftRequest {
  /**
   * When to send it, at most 30 days out. Left out, the time proposed on the
   * draft while it is ahead, or now.
   */
  scheduled_at?: string
}

export interface ReplyThreadRequest {
  /**
   * The sender, `you@yourdomain.com` or `Name <you@yourdomain.com>`. Defaults to
   * the thread's own; from a connection made an inbox, to its inbox on the
   * thread — the one mail on the thread last went through, on a tie the one the
   * thread is filed under. With several and none of them on the thread, it has
   * to be named.
   */
  from?: Sender
  /**
   * The email in the thread this answers. Its Reply-To, sender and recipients
   * decide whom the reply goes to, and `In-Reply-To` names it — also when a
   * draft or scheduled reply goes out later. Defaults to the thread's latest
   * email. Pass the id from `email.received` so mail arriving meanwhile cannot
   * change whom you answer.
   */
  email_id?: string
  /**
   * Recipients in place of the ones the answered email implies — its Reply-To,
   * else its sender, or when that email is yours, whom it went to: one address
   * or a list, at most 100.
   */
  to?: string | string[]
  /**
   * Answer everyone on the answered email, as a mail client's Reply all does:
   * its Reply-To (else its sender) and its `to` go in `to`, its `cc` in `cc`.
   * With a Reply-To set, the sender is left out, as in Gmail. Only the address
   * the reply goes out as, and its mailbox's aliases, are left off; colleagues
   * stay. When the email is yours, its `to` and `cc` again. A `cc` given is
   * added to the inferred one; a `to` given replaces it.
   */
  reply_all?: boolean
  /** The subject, in place of `Re:` and the thread's. */
  subject?: string
  /** Cc recipients: one address or a list, at most 100. */
  cc?: string | string[]
  /** Bcc recipients, hidden from the others: one address or a list, at most 100. */
  bcc?: string | string[]
  /**
   * Where replies go (Reply-To), when not to the sender: one address or a list,
   * at most 100.
   */
  reply_to?: string | string[]
  /**
   * Files to attach, at most 20 and 3 MB decoded in total: `filename`,
   * `content_type` and `content` in base64, and a `cid` to make one an inline
   * image.
   */
  attachments?: AttachmentInput[]
  /**
   * Extra headers to write on the message. `Message-ID`, `In-Reply-To` and
   * `References` are the API's to write and are refused.
   */
  headers?: Record<string, string>
  /**
   * The suppression list the send is checked against, besides the workspace-wide
   * `*` list.
   */
  suppression_key?: string
  pacing?: SendPacing
  tracking?: SendTracking
  /**
   * When to send, as an ISO 8601 time, at most 30 days out. On a draft, the time
   * proposed for it.
   */
  scheduled_at?: string
  /**
   * Keep it as a draft for a person to review: nothing is sent until it is sent
   * with `POST /emails/{id}/send` or from the console, at `draft.review_url`. A
   * draft uses none of the plan's emails until then.
   */
  draft?: boolean
  /** The HTML body. */
  html?: string
  /** The plain-text body. */
  text?: string
  /**
   * Marks the email non-essential: it carries one-click unsubscribe headers, and
   * `optional` suppressions apply to it. One recipient only.
   */
  unsubscribe?: boolean
}

export interface ForwardThreadRequest {
  /**
   * The sender, `you@yourdomain.com` or `Name <you@yourdomain.com>`. Defaults to
   * the thread's mailbox; from a connection made an inbox, to its inbox on the
   * thread — the one mail on the thread last went through, on a tie the one the
   * thread is filed under. With several and none of them on the thread, it has
   * to be named.
   */
  from?: Sender
  /** Recipients: one address or a list, at most 100. */
  to: string | string[]
  /** The subject. Defaults to `Fwd:` and the thread's. */
  subject?: string
  /** Text placed above the forwarded conversation. */
  note?: string
  /** Whether the thread's attachments go along. */
  include_attachments?: boolean
  /** Cc recipients: one address or a list, at most 100. */
  cc?: string | string[]
  /** Bcc recipients, hidden from the others: one address or a list, at most 100. */
  bcc?: string | string[]
  /**
   * Where replies go (Reply-To), when not to the sender: one address or a list,
   * at most 100.
   */
  reply_to?: string | string[]
  /**
   * Files to attach, at most 20 and 3 MB decoded in total: `filename`,
   * `content_type` and `content` in base64, and a `cid` to make one an inline
   * image.
   */
  attachments?: AttachmentInput[]
  /**
   * Extra headers to write on the message. `Message-ID`, `In-Reply-To` and
   * `References` are the API's to write and are refused.
   */
  headers?: Record<string, string>
  /**
   * The suppression list the send is checked against, besides the workspace-wide
   * `*` list.
   */
  suppression_key?: string
  pacing?: SendPacing
  tracking?: SendTracking
  /**
   * When to send, as an ISO 8601 time, at most 30 days out. On a draft, the time
   * proposed for it.
   */
  scheduled_at?: string
  /**
   * Keep it as a draft for a person to review: nothing is sent until it is sent
   * with `POST /emails/{id}/send` or from the console, at `draft.review_url`. A
   * draft uses none of the plan's emails until then.
   */
  draft?: boolean
}

export interface CreateDomainRequest {
  /**
   * A domain, a wildcard (`*.acme.dev`), or one label under a wildcard you own
   * (`hi.acme.dev`) — the last is created as a subdomain with no records.
   */
  name: string
  /** The region the domain's mail is handled in. */
  region?: MailRegion
  /** Which space a created resource goes in. Omitted, the workspace itself. */
  space_id?: string
  /** Whether opens are tracked on mail sent from the domain. */
  track_opens?: boolean
  /** Whether links are rewritten to track clicks on mail sent from the domain. */
  track_clicks?: boolean
}

export interface UpdateDomainRequest {
  /** Whether opens are tracked on mail sent from the domain. */
  track_opens?: boolean
  /** Whether links are rewritten to track clicks on mail sent from the domain. */
  track_clicks?: boolean
  /**
   * Move a domain that has not verified yet to another region. Its MX and
   * return-path records change with it and start over as pending; DKIM does not.
   * `409 region_fixed` once it is verified, or on a subdomain.
   */
  region?: MailRegion
}

export interface ConnectMailboxRequest {
  /** `google` for Gmail, `microsoft` for Outlook. */
  provider: MailboxProvider
  /** Your own OAuth app to connect through, so consent shows your product's name. */
  app_id?: string
  /** Which space a created resource goes in. Omitted, the workspace itself. */
  space_id?: string
  /** Where the person is sent once they have authorized. */
  return_to: string
  /**
   * Your own identifier for whoever the mailbox belongs to. Kept on the mailbox
   * and carried on every `mailbox.*` event.
   */
  ref?: string
  /**
   * Your own key-value pairs, stored and given back as they are. Up to 50 keys;
   * a key is 1–40 characters, a value up to 500. Written whole: what you send
   * replaces what was there.
   */
  metadata?: Record<string, string>
  /** The region the mailbox's mail is handled in. */
  region?: MailRegion
  /** Days of existing mail to import, up to 90. */
  backfill_days?: number
}

export interface CreateOAuthAppRequest {
  /** `google` for Gmail, `microsoft` for Outlook. */
  provider: MailboxProvider
  /** Your product's name, as the consent screen shows it. */
  name: string
  /** The connect URL's name. Unique across all of AI Inbx. */
  slug: string
  /** The OAuth client id, from Google Cloud or Microsoft Entra. */
  client_id: string
  /** The OAuth client secret that goes with the client id. */
  client_secret: string
  /** Microsoft only: the Entra tenant, for an app registered to one. */
  tenant?: string
  /** Google only: your Pub/Sub topic, which Gmail publishes mailbox changes to. */
  pubsub_topic?: string
  /** The accent colour of your connect page. */
  accent?: string
  /** A line under your product's name on the connect page. */
  tagline?: string
  /** Where people connecting a mailbox can reach you. */
  support_email?: string
  /** Your logo, linked from your own server. */
  logo_url?: string
  /** The pages a connect link may return to. Replaced whole on update. */
  return_urls?: string[]
}

export interface UpdateOAuthAppRequest {
  /** Your product's name, as the consent screen shows it. */
  name?: string
  /** The OAuth client id, from Google Cloud or Microsoft Entra. */
  client_id?: string
  /** The OAuth client secret that goes with the client id. */
  client_secret?: string
  /**
   * Microsoft only: the Entra tenant, for an app registered to one. Null clears
   * it.
   */
  tenant?: string | null
  /**
   * Google only: your Pub/Sub topic, which Gmail publishes mailbox changes to.
   * Null clears it.
   */
  pubsub_topic?: string | null
  /** The accent colour of your connect page. Null clears it. */
  accent?: string | null
  /** A line under your product's name on the connect page. Null clears it. */
  tagline?: string | null
  /** Where people connecting a mailbox can reach you. Null clears it. */
  support_email?: string | null
  /** Your logo, linked from your own server. Null clears it. */
  logo_url?: string | null
  /** The pages a connect link may return to. Replaced whole on update. */
  return_urls?: string[]
}

export interface WebhookEndpointRequest {
  /** Where deliveries are POSTed. */
  url: string
  /** Whether the endpoint receives deliveries. */
  enabled?: boolean
  /** The event types to deliver, at least one. */
  subscriptions: WebhookEventType[]
  /**
   * Rules that narrow delivery by sender or recipient, such as
   * `[{"effect":"block","field":"from","pattern":"..."}]`. A matching block
   * wins.
   */
  routing?: WebhookRoutingRule[]
  /** Deliveries in flight to this endpoint at once. */
  max_concurrency?: number
  /**
   * How much of a message `email.received` and `email.sent` carry. `summary` is
   * the addresses, subject and snippet; `full` adds `data.email`, the email as
   * `GET /emails/{id}?include=attachment_content` returns it, so a handler has
   * no second call to make. Every other event is the same either way, and an
   * endpoint whose `format` is `v1` cannot be `full`.
   */
  payload?: "summary" | "full"
}

export interface UpdateWebhookEndpointRequest {
  /** Where deliveries are POSTed. */
  url?: string
  /** Whether the endpoint receives deliveries. */
  enabled?: boolean
  /** The event types to deliver, at least one. */
  subscriptions?: WebhookEventType[]
  /**
   * Rules that narrow delivery by sender or recipient, such as
   * `[{"effect":"block","field":"from","pattern":"..."}]`. A matching block
   * wins.
   */
  routing?: WebhookRoutingRule[]
  /** Deliveries in flight to this endpoint at once. */
  max_concurrency?: number
  /**
   * How much of a message `email.received` and `email.sent` carry. `summary` is
   * the addresses, subject and snippet; `full` adds `data.email`, the email as
   * `GET /emails/{id}?include=attachment_content` returns it, so a handler has
   * no second call to make. Every other event is the same either way, and an
   * endpoint whose `format` is `v1` cannot be `full`.
   */
  payload?: "summary" | "full"
}

export interface RotateWebhookSecretRequest {
  /**
   * Seconds the old secret keeps verifying: a day by default, a week at most, 0
   * after a leak.
   */
  grace_seconds?: number
}

export interface RetryDeliveriesRequest {
  /** The deliveries to replay, at most 100. */
  delivery_ids: string[]
}

export interface WebhookTestRequest {
  /** The event type to deliver. */
  event_type: WebhookEventType
  /** The id the test event is about. */
  resource_id?: string
  /** The event's `data`, sent verbatim. */
  payload?: Record<string, unknown>
}

export interface SuppressionRequest {
  /** The addresses to suppress, at most 1,000. */
  addresses: string[]
  /**
   * The list: a `suppression_key` your sends name, or `*` for the workspace-wide
   * one.
   */
  key?: string
  /** Which space a created resource goes in. Omitted, the workspace itself. */
  space_id?: string
  /** `all` stops every send; `optional` only sends marked `unsubscribe`. */
  scope?: SuppressionScope
  /** Why the addresses are listed, for your records. */
  note?: string
}

export interface PacingRuleRequestHours {
  /** The rule's name. */
  name: string
  /** Which space a created resource goes in. Omitted, the workspace itself. */
  space_id?: string
  /**
   * Whether the rule applies. A disabled one holds nothing and takes no plan
   * allowance.
   */
  enabled?: boolean
  /**
   * Which sends the rule reads, such as `[{"field":"to","pattern":"..."}]`. `[]`
   * catches nothing; `[{"field":"from","pattern":"*"}]` catches every send.
   */
  match: PacingMatch[]
  /** `hours` holds mail outside weekly windows. */
  kind: "hours"
  /**
   * An `hours` rule's weekly windows, such as
   * `{"timezone":"Europe/Berlin","windows":[{"days":[0,1,2,3,4],"start_minute":540,"end_minute":1020}]}`.
   */
  schedule: PacingSchedule
}

export interface PacingRuleRequestLimit {
  /** The rule's name. */
  name: string
  /** Which space a created resource goes in. Omitted, the workspace itself. */
  space_id?: string
  /**
   * Whether the rule applies. A disabled one holds nothing and takes no plan
   * allowance.
   */
  enabled?: boolean
  /**
   * Which sends the rule reads, such as `[{"field":"to","pattern":"..."}]`. `[]`
   * catches nothing; `[{"field":"from","pattern":"*"}]` catches every send.
   */
  match: PacingMatch[]
  /** `limit` caps sends per rolling window. */
  kind: "limit"
  /**
   * A `limit` rule's cap, such as
   * `{"scope":"to_domain","amount":100,"per_seconds":3600}`.
   */
  limit: PacingLimit
}

export type PacingRuleRequest = PacingRuleRequestHours | PacingRuleRequestLimit

export interface UpdatePacingRuleRequest {
  /** The rule's name. */
  name?: string
  /**
   * Whether the rule applies. A disabled one holds nothing and takes no plan
   * allowance.
   */
  enabled?: boolean
  /**
   * Which sends the rule reads, such as `[{"field":"to","pattern":"..."}]`. `[]`
   * catches nothing; `[{"field":"from","pattern":"*"}]` catches every send.
   */
  match?: PacingMatch[]
  /**
   * `hours` holds mail outside weekly windows; `limit` caps sends per rolling
   * window.
   */
  kind?: "hours" | "limit"
  /**
   * An `hours` rule's weekly windows, such as
   * `{"timezone":"Europe/Berlin","windows":[{"days":[0,1,2,3,4],"start_minute":540,"end_minute":1020}]}`.
   */
  schedule?: PacingSchedule
  /**
   * A `limit` rule's cap, such as
   * `{"scope":"to_domain","amount":100,"per_seconds":3600}`.
   */
  limit?: PacingLimit
}

export interface PacingSpreadRequest {
  /** Randomness in send timing, 0 to 100: 0 is a metronome. */
  spread: number
}

export interface PacingReleaseRequest {
  /** The held emails to release, at most 500. */
  email_ids: string[]
  /** Whether released mail uses up the rules' budget. */
  count_toward_limits?: boolean
}

export interface UpdateWorkspaceRequest {
  /** The workspace's name. */
  name?: string
  /**
   * What a domain added from now on starts with. Only the fields given change;
   * existing domains keep theirs.
   */
  tracking?: {
    opens?: boolean
    clicks?: boolean
  }
}

export interface UpdateMemberRequest {
  role: MemberRole
}

export interface CreateInvitationRequest {
  /** The address to invite. */
  email: string
  role?: MemberRole
}

export interface Problem {
  type: string
  title: string
  status: number
  detail: string
  code: string
  request_id: string
  issues?: {
    path: string
    message: string
  }[]
}

/**
 * A group of domains, mailboxes and mail — one per customer, typically.
 * Optional: a workspace that never creates one sees `space_id: null`
 * everywhere.
 */
export interface Space {
  id: string
  name: string
  /** Your own id for the customer, if you set one. */
  external_id: string | null
  created_at: string
}

export type SpacePage = Page<Space>

export interface ApiKey {
  id: string
  name: string
  scope: ApiKeyScope
  prefix: string
  last_used_at: string | null
  created_at: string
}

/** A newly issued key. The full `key` is returned only once. */
export interface ApiKeyCreated {
  id: string
  name: string
  scope: ApiKeyScope
  prefix: string
  last_used_at: string | null
  created_at: string
  key: string
}

export type ApiKeyPage = Page<ApiKey>

export interface Email {
  id: string
  thread_id: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  direction: EmailDirection
  status: EmailStatus
  from: EmailAddress
  to: string[]
  /**
   * On received mail, every address of yours it arrived at so far, whatever its
   * To and Cc say. Empty on mail you sent.
   */
  delivered_to: string[]
  cc?: string[]
  bcc?: string[]
  reply_to?: string[]
  subject: string
  snippet: string
  html?: string | null
  text?: string | null
  category: EmailCategory | null
  verdicts: EmailVerdicts | null
  verification: EmailVerification | null
  unavailable: EmailUnavailable | null
  suppression_key: string | null
  /** The RFC Message-ID, without angle brackets. */
  message_id: string
  /**
   * The Message-ID of the message this one answers, without angle brackets. Null
   * when it answers none.
   */
  in_reply_to: string | null
  idempotency_key: string | null
  /**
   * When it took its place in its thread. A draft's moves to when it is sent —
   * `draft.drafted_at` keeps when it was written.
   */
  created_at: string
  scheduled_at: string | null
  sent_at: string | null
  draft: EmailDraft | null
  attachments?: Attachment[]
}

export interface FullEmail {
  id: string
  thread_id: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  direction: EmailDirection
  status: EmailStatus
  from: EmailAddress
  to: string[]
  /**
   * On received mail, every address of yours it arrived at so far, whatever its
   * To and Cc say. Empty on mail you sent.
   */
  delivered_to: string[]
  cc: string[]
  bcc: string[]
  reply_to: string[]
  subject: string
  snippet: string
  html: string | null
  text: string | null
  category: EmailCategory | null
  verdicts: EmailVerdicts | null
  verification: EmailVerification | null
  unavailable: EmailUnavailable | null
  suppression_key: string | null
  /** The RFC Message-ID, without angle brackets. */
  message_id: string
  /**
   * The Message-ID of the message this one answers, without angle brackets. Null
   * when it answers none.
   */
  in_reply_to: string | null
  idempotency_key: string | null
  /**
   * When it took its place in its thread. A draft's moves to when it is sent —
   * `draft.drafted_at` keeps when it was written.
   */
  created_at: string
  scheduled_at: string | null
  sent_at: string | null
  draft: EmailDraft | null
  attachments: Attachment[]
  /**
   * What this message says: typed text only, quoted conversation and signature
   * removed. A signature the thread has not seen from this sender stays — it is
   * where the name and role are.
   */
  stripped_text: string | null
  /**
   * The HTML part with the same cut as stripped_text: quoted conversation and
   * repeated signature removed, an answer typed into the quote kept under the
   * line it answers. Null when the message has no HTML part or its markup can't
   * be cut cleanly — render `html` then.
   */
  stripped_html: string | null
  segments: BodySegment[]
  /**
   * The Message-IDs of the conversation so far, oldest first, without angle
   * brackets.
   */
  references: string[]
  headers: EmailHeader[]
  events: DeliveryEvent[]
  engagements: Engagement[]
}

export interface SendEmailResponse {
  id: string
  thread_id: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  direction: EmailDirection
  status: EmailStatus
  from: EmailAddress
  to: string[]
  /**
   * On received mail, every address of yours it arrived at so far, whatever its
   * To and Cc say. Empty on mail you sent.
   */
  delivered_to: string[]
  cc?: string[]
  bcc?: string[]
  reply_to?: string[]
  subject: string
  snippet: string
  html?: string | null
  text?: string | null
  category: EmailCategory | null
  verdicts: EmailVerdicts | null
  verification: EmailVerification | null
  unavailable: EmailUnavailable | null
  suppression_key: string | null
  /** The RFC Message-ID, without angle brackets. */
  message_id: string
  /**
   * The Message-ID of the message this one answers, without angle brackets. Null
   * when it answers none.
   */
  in_reply_to: string | null
  idempotency_key: string | null
  /**
   * When it took its place in its thread. A draft's moves to when it is sent —
   * `draft.drafted_at` keeps when it was written.
   */
  created_at: string
  scheduled_at: string | null
  sent_at: string | null
  draft: EmailDraft | null
  attachments?: Attachment[]
  suppressed: string[]
  pacing: EmailPacing | null
}

export type EmailPage = Page<Email>

export interface Thread {
  id: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  subject: string
  mailbox: string
  participants: string[]
  message_count: number
  last_message_at: string
  /** The thread this one was forwarded from, when a forward opened it. */
  forward_of: string | null
  messages?: FullEmail[]
  messages_next_cursor?: string | null
}

export interface FullThread {
  id: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  subject: string
  mailbox: string
  participants: string[]
  message_count: number
  last_message_at: string
  /** The thread this one was forwarded from, when a forward opened it. */
  forward_of: string | null
  messages: FullEmail[]
  messages_next_cursor: string | null
}

export type ThreadPage = Page<Thread>

export interface Domain {
  id: string
  name: string
  /**
   * Where the domain's mail is handled today. A domain carried over from the
   * previous aiinbx reports `us-east-1` until its records verify here, then the
   * region chosen for it.
   */
  region: MailRegion
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  /** The wildcard this subdomain is filed under, when it is one. */
  parent_id: string | null
  /**
   * Whether this is the domain the workspace was given — `<slug>.aiinbx.app`.
   * Verified through our own zone, so it has no records and cannot be deleted.
   */
  provided: boolean
  verified_at: string | null
  /**
   * When the DKIM record of this verified domain, or of its wildcard, was found
   * missing from DNS. The domain keeps sending meanwhile. Null while the record
   * resolves.
   */
  dkim_missing_since: string | null
  /**
   * When the domain is lost if the DKIM record is not restored: 72 hours after
   * `dkim_missing_since`. Then `verified_at` goes null and `domain.lost` is
   * sent.
   */
  stops_sending_at: string | null
  created_at: string
  tracking: DomainTracking
  records?: DnsRecord[]
}

export type DomainPage = Page<Domain>

export interface DnsDiagnosticsResponse {
  data: DnsFinding[]
}

export interface Mailbox {
  id: string
  provider: MailboxProvider
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  address: string
  name: string | null
  aliases: {
    address: string
    name: string | null
  }[]
  state: MailboxState
  state_reason: string | null
  region: MailRegion
  app_id: string | null
  ref: string | null
  /**
   * Your own key-value pairs, stored and given back as they are. Up to 50 keys;
   * a key is 1–40 characters, a value up to 500. Written whole: what you send
   * replaces what was there.
   */
  metadata: Record<string, string>
  connected_at: string
  last_sync_at: string | null
}

export type MailboxPage = Page<Mailbox>

export interface MailboxSyncResponse {
  status: "queued"
}

export interface ConnectMailboxResponse {
  url: string
}

export interface OAuthApp {
  id: string
  provider: MailboxProvider
  name: string
  slug: string
  client_id: string
  tenant: string | null
  pubsub_topic: string | null
  accent: string | null
  tagline: string | null
  support_email: string | null
  /**
   * A logo linked from the customer's own server. An uploaded one is served from
   * us and is not linkable through the API.
   */
  logo_url: string | null
  connect_url: string
  /**
   * The pages a connect link — `connect_url` + `/start?return_to=…` — may return
   * to. Matched on origin and path.
   */
  return_urls: string[]
  redirect_uri: string
  push_endpoint: string | null
  created_at: string
}

export type OAuthAppPage = Page<OAuthApp>

export interface WebhookEndpoint {
  id: string
  url: string
  enabled: boolean
  /**
   * Read-only. `v1` marks an endpoint carried over from the previous aiinbx.com:
   * it receives that system's bodies and can subscribe only to the events it had
   * — `email.received`, `email.delivered`, `email.bounced`, `email.complained`,
   * `email.failed`, `email.opened`, `email.clicked`. Endpoints created here are
   * `v2`.
   */
  format: "v2" | "v1"
  subscriptions: WebhookEventType[]
  routing: WebhookRoutingRule[]
  max_concurrency: number
  /**
   * How much of a message `email.received` and `email.sent` carry. `summary` is
   * the addresses, subject and snippet; `full` adds `data.email`, the email as
   * `GET /emails/{id}?include=attachment_content` returns it, so a handler has
   * no second call to make. Every other event is the same either way, and an
   * endpoint whose `format` is `v1` cannot be `full`.
   */
  payload: "summary" | "full"
  previous_secret_expires_at: string | null
  created_at: string
  updated_at: string
  secret?: string
}

/** A newly created endpoint. Its signing `secret` is returned only once. */
export interface WebhookEndpointCreated {
  id: string
  url: string
  enabled: boolean
  /**
   * Read-only. `v1` marks an endpoint carried over from the previous aiinbx.com:
   * it receives that system's bodies and can subscribe only to the events it had
   * — `email.received`, `email.delivered`, `email.bounced`, `email.complained`,
   * `email.failed`, `email.opened`, `email.clicked`. Endpoints created here are
   * `v2`.
   */
  format: "v2" | "v1"
  subscriptions: WebhookEventType[]
  routing: WebhookRoutingRule[]
  max_concurrency: number
  /**
   * How much of a message `email.received` and `email.sent` carry. `summary` is
   * the addresses, subject and snippet; `full` adds `data.email`, the email as
   * `GET /emails/{id}?include=attachment_content` returns it, so a handler has
   * no second call to make. Every other event is the same either way, and an
   * endpoint whose `format` is `v1` cannot be `full`.
   */
  payload: "summary" | "full"
  previous_secret_expires_at: string | null
  created_at: string
  updated_at: string
  secret: string
}

export type WebhookEndpointPage = Page<WebhookEndpoint>

export interface WebhookDelivery {
  id: string
  event_id: string
  event_type: WebhookEventType
  /**
   * What the event is about: the email, thread, domain or mailbox, or for
   * `email.unsubscribed` the suppression. A test event's is the `resource_id` it
   * was sent with.
   */
  resource_id: string
  state: DeliveryState
  next_attempt_at: string | null
  created_at: string
  /**
   * The event envelope the endpoint receives, as stored: a `full` endpoint's is
   * shown without `data.email`, which is read from the message when a delivery
   * is sent and not kept. Null for a `v1` endpoint in a listing — its legacy
   * body is built from the message when it is sent and is not stored — and for a
   * delivery nothing was sent for: a `v1` endpoint's event whose subject no
   * longer exists is settled as failed with no attempts.
   */
  body: WebhookEvent | Record<string, unknown> | null
  attempts: WebhookAttempt[]
}

export type WebhookDeliveryPage = Page<WebhookDelivery>

export interface WebhookSecretResponse {
  secret: string
  previous_secret_expires_at: string | null
}

export interface WebhookTestResponse {
  delivery_id: string
  state: DeliveryState
  status_code: number | null
  duration_ms: number | null
  error: string | null
  response: string | null
}

export interface WebhookEventEmailReceived {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "email.received"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: EmailReceivedEventData
}

export interface WebhookEventEmailSent {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "email.sent"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: EmailSentEventData
}

export interface WebhookEventEmailDelivered {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "email.delivered"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: EmailDeliveredEventData
}

export interface WebhookEventEmailBounced {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "email.bounced"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: EmailBouncedEventData
}

export interface WebhookEventEmailComplained {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "email.complained"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: EmailComplainedEventData
}

export interface WebhookEventEmailFailed {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "email.failed"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: EmailFailedEventData
}

export interface WebhookEventEmailUnsubscribed {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "email.unsubscribed"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: EmailUnsubscribedEventData
}

export interface WebhookEventEmailOpened {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "email.opened"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: EmailOpenedEventData
}

export interface WebhookEventEmailClicked {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "email.clicked"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: EmailClickedEventData
}

export interface WebhookEventThreadCreated {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "thread.created"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: ThreadCreatedEventData
}

export interface WebhookEventDomainVerified {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "domain.verified"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: DomainEventData
}

export interface WebhookEventDomainAtRisk {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "domain.at_risk"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: DomainAtRiskEventData
}

export interface WebhookEventDomainRestored {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "domain.restored"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: DomainEventData
}

export interface WebhookEventDomainLost {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "domain.lost"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: DomainEventData
}

export interface WebhookEventMailboxConnected {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "mailbox.connected"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: MailboxConnectedEventData
}

export interface WebhookEventMailboxNeedsReauth {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "mailbox.needs_reauth"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: MailboxStateEventData
}

export interface WebhookEventMailboxDisconnected {
  /** The event, `evt_…`. Stable across retries and replays: deduplicate on it. */
  id: string
  type: "mailbox.disconnected"
  /** When the event happened. */
  created_at: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  data: MailboxStateEventData
}

export type WebhookEvent =
  | WebhookEventEmailReceived
  | WebhookEventEmailSent
  | WebhookEventEmailDelivered
  | WebhookEventEmailBounced
  | WebhookEventEmailComplained
  | WebhookEventEmailFailed
  | WebhookEventEmailUnsubscribed
  | WebhookEventEmailOpened
  | WebhookEventEmailClicked
  | WebhookEventThreadCreated
  | WebhookEventDomainVerified
  | WebhookEventDomainAtRisk
  | WebhookEventDomainRestored
  | WebhookEventDomainLost
  | WebhookEventMailboxConnected
  | WebhookEventMailboxNeedsReauth
  | WebhookEventMailboxDisconnected

export type EventPage = Page<WebhookEvent>

export interface Suppression {
  id: string
  address: string
  key: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  reason: SuppressionReason
  scope: SuppressionScope
  note: string | null
  blocks: number
  last_blocked_at: string | null
  source_email_id: string | null
  created_at: string
}

export type SuppressionPage = Page<Suppression>

export interface SuppressionBatch {
  data: Suppression[]
}

export interface SuppressionDeleted {
  id: string
  /**
   * True when SES still refuses the address off its own suppression list, which
   * keeps addresses that hard-bounced as dead: sends to it keep failing as
   * `bad_address` bounces whatever your lists say. Null when that could not be
   * checked just now.
   */
  provider_suppressed: boolean | null
}

export interface PacingRuleHours {
  id: string
  name: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  enabled: boolean
  builtin: boolean
  match: PacingMatch[]
  created_at: string
  kind: "hours"
  schedule: PacingScheduleState
}

export interface PacingRuleLimit {
  id: string
  name: string
  /**
   * Which space a resource is in. Null is the workspace itself — what every
   * resource of a workspace that has no spaces says.
   */
  space_id: string | null
  enabled: boolean
  builtin: boolean
  match: PacingMatch[]
  created_at: string
  /** `limit` caps sends per rolling window. */
  kind: "limit"
  /**
   * A `limit` rule's cap, such as
   * `{"scope":"to_domain","amount":100,"per_seconds":3600}`.
   */
  limit: PacingLimit
}

export type PacingRule = PacingRuleHours | PacingRuleLimit

export type PacingRulePage = Page<PacingRule>

export interface PacingSpread {
  spread: number
}

export interface PacingQueue {
  data: PacingQueueItem[]
  total: number
  sampled: number
  as_of: string
  spread: number
  rules: PacingRule[]
  rule_counts: PacingRuleCount[]
}

export interface IdListResponse {
  data: string[]
}

/** A workspace: the account that owns everything else. */
export interface Workspace {
  id: string
  name: string
  /**
   * The handle in console URLs. It follows the name; the provided domain keeps
   * the slug the workspace was created with.
   */
  slug: string
  /**
   * What the caller may do here: the role of the person a token acts for. Null
   * for an API key, which acts with its creator's current rights: admin-only
   * operations answer 403 once the creator is no longer an admin or has left.
   */
  role: WorkspaceRole | null
  /** What a domain added from now on starts with. */
  tracking: DomainTracking
  /**
   * The inboxes the caller is held to here, when it was connected as an inbox:
   * it reads their mail and sends as them, and nothing else. Null for a
   * connection to the whole workspace, and for an API key.
   */
  inboxes: Inbox[] | null
  created_at: string
}

export interface WorkspaceList {
  data: Workspace[]
  mode: ConnectionMode
}

export interface Member {
  id: string
  name: string
  email: string
  role: WorkspaceRole
  joined_at: string
  /** When they last used the console. Null if they never have. */
  last_active_at: string | null
}

export interface MemberList {
  data: Member[]
}

export interface Invitation {
  id: string
  email: string
  role: MemberRole
  /** Who sent it, by name — or email when they gave none. */
  invited_by: string
  created_at: string
  expires_at: string
}

export interface InvitationList {
  data: Invitation[]
}

export interface ListSpacesQuery {
  /** Maximum number of resources to return. */
  limit?: number
  /** Opaque cursor from the previous page. */
  cursor?: string
  /**
   * Only the space with this `external_id` — the id you gave it for the customer
   * it stands for. Exact match; the page holds one space or none.
   */
  external_id?: string
}

export interface ListApiKeysQuery {
  /** Maximum number of resources to return. */
  limit?: number
  /** Opaque cursor from the previous page. */
  cursor?: string
}

export interface ListEmailsQuery {
  /** Maximum number of resources to return. */
  limit?: number
  /** Opaque cursor from the previous page. */
  cursor?: string
  /**
   * Only resources in this space. Pass `none` for resources that belong to the
   * workspace itself (`space_id: null`), or omit for the workspace and all its
   * spaces.
   */
  space?: string
  /**
   * Only what was created after this instant — `created_at` later than it, the
   * instant itself left out. ISO 8601 with an offset.
   */
  after?: string
  /**
   * Only what was created before this instant — `created_at` earlier than it,
   * the instant itself left out. ISO 8601 with an offset.
   */
  before?: string
  /**
   * Which way the list is walked by `created_at`: `desc` is newest first, `asc`
   * oldest first — the order a sync reads in. A cursor is a position, not a
   * direction: send the same `order` with it.
   */
  order?: "asc" | "desc"
  /** Filter by message direction. */
  direction?: "inbound" | "outbound"
  /** Filter by delivery status. */
  status?:
    | "draft"
    | "scheduled"
    | "canceled"
    | "discarded"
    | "queued"
    | "sending"
    | "sent"
    | "delivered"
    | "bounced"
    | "complained"
    | "failed"
    | "received"
  /** Filter to one thread. */
  thread_id?: string
  /**
   * Words to find in the subject, sender, recipients or Message-ID. Every word
   * must match.
   */
  query?: string
}

export interface RetrieveEmailQuery {
  /**
   * Expand optional content. Pass attachment_content to include prepared
   * attachment text.
   */
  include?: "attachment_content"[]
}

export interface ListThreadsQuery {
  /** Maximum number of resources to return. */
  limit?: number
  /** Opaque cursor from the previous page. */
  cursor?: string
  /**
   * Only resources in this space. Pass `none` for resources that belong to the
   * workspace itself (`space_id: null`), or omit for the workspace and all its
   * spaces.
   */
  space?: string
  /**
   * Words to find in the subject, mailbox or participants. Every word must
   * match.
   */
  query?: string
  /** Filter by mailbox address. */
  mailbox?: string
}

export interface RetrieveThreadQuery {
  /** Maximum messages to return. */
  message_limit?: number
  /** Continue after this email from the previous page. */
  message_cursor?: string
}

export interface ListDomainsQuery {
  /** Maximum number of resources to return. */
  limit?: number
  /** Opaque cursor from the previous page. */
  cursor?: string
  /**
   * Only resources in this space. Pass `none` for resources that belong to the
   * workspace itself (`space_id: null`), or omit for the workspace and all its
   * spaces.
   */
  space?: string
}

export interface ListMailboxesQuery {
  /** Maximum number of resources to return. */
  limit?: number
  /** Opaque cursor from the previous page. */
  cursor?: string
  /**
   * Only resources in this space. Pass `none` for resources that belong to the
   * workspace itself (`space_id: null`), or omit for the workspace and all its
   * spaces.
   */
  space?: string
}

export interface ListOAuthAppsQuery {
  /** Maximum number of resources to return. */
  limit?: number
  /** Opaque cursor from the previous page. */
  cursor?: string
}

export interface ListWebhookEndpointsQuery {
  /** Maximum number of resources to return. */
  limit?: number
  /** Opaque cursor from the previous page. */
  cursor?: string
}

export interface ListWebhookDeliveriesQuery {
  /** Maximum number of resources to return. */
  limit?: number
  /** Opaque cursor from the previous page. */
  cursor?: string
  /** Filter by delivery state. */
  state?: "pending" | "delivered" | "failed"
}

export interface ListEventsQuery {
  /** Maximum number of resources to return. */
  limit?: number
  /** Opaque cursor from the previous page. */
  cursor?: string
  /**
   * Only resources in this space. Pass `none` for resources that belong to the
   * workspace itself (`space_id: null`), or omit for the workspace and all its
   * spaces.
   */
  space?: string
  /**
   * Only what was created after this instant — `created_at` later than it, the
   * instant itself left out. ISO 8601 with an offset.
   */
  after?: string
  /**
   * Only what was created before this instant — `created_at` earlier than it,
   * the instant itself left out. ISO 8601 with an offset.
   */
  before?: string
  /**
   * Which way the list is walked by `created_at`: `desc` is newest first, `asc`
   * oldest first — the order a sync reads in. A cursor is a position, not a
   * direction: send the same `order` with it.
   */
  order?: "asc" | "desc"
  /**
   * Only events of this type. Repeat the parameter for any of several:
   * `type=email.bounced&type=email.failed`.
   */
  type?: (
    | "email.received"
    | "email.sent"
    | "email.delivered"
    | "email.bounced"
    | "email.complained"
    | "email.failed"
    | "email.unsubscribed"
    | "email.opened"
    | "email.clicked"
    | "thread.created"
    | "domain.verified"
    | "domain.at_risk"
    | "domain.restored"
    | "domain.lost"
    | "mailbox.connected"
    | "mailbox.needs_reauth"
    | "mailbox.disconnected"
  )[]
  /**
   * Only events about this email: received or sent, delivered, bounced,
   * complained, failed, opened, clicked. `email.unsubscribed` is about the
   * address that left, and is not among them.
   */
  email_id?: string
}

export interface ListSuppressionsQuery {
  /** Maximum number of resources to return. */
  limit?: number
  /** Opaque cursor from the previous page. */
  cursor?: string
  /**
   * Only resources in this space. Pass `none` for resources that belong to the
   * workspace itself (`space_id: null`), or omit for the workspace and all its
   * spaces.
   */
  space?: string
  /** Filter by suppression list key. */
  key?: string
  /** Search recipient addresses. */
  address?: string
  /** Filter by suppression reason. */
  reason?: "complaint" | "bounce" | "unsubscribe" | "manual"
}

export interface ListPacingRulesQuery {
  /** Maximum number of resources to return. */
  limit?: number
  /** Opaque cursor from the previous page. */
  cursor?: string
  /**
   * Only resources in this space. Pass `none` for resources that belong to the
   * workspace itself (`space_id: null`), or omit for the workspace and all its
   * spaces.
   */
  space?: string
}

export interface RetrievePacingQueueQuery {
  /** Maximum queued emails to return. */
  limit?: number
  /**
   * Only resources in this space. Pass `none` for resources that belong to the
   * workspace itself (`space_id: null`), or omit for the workspace and all its
   * spaces.
   */
  space?: string
}
