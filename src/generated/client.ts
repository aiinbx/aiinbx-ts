// Generated from @workspace/api-contract by `bun run sdk:generate`. Do not edit.

import { APIClient, type BaseClientOptions } from "../core.js"
import {
  Spaces,
  Addresses,
  ApiKeys,
  Emails,
  Threads,
  Domains,
  Mailboxes,
  OauthApps,
  WebhookEndpoints,
  Events,
  Suppressions,
  PacingRules,
  Pacing,
  Workspaces,
  Members,
  Invitations,
  Attachments,
} from "../resources.js"

export interface ClientOptions extends BaseClientOptions {
  /**
   * Workspace id from `GET /workspaces`, for an OAuth token that reaches
   * several. Sent as `AIInbx-Workspace`.
   */
  workspaceId?: string
}

export class AIInbx extends APIClient {
  readonly spaces: Spaces
  readonly addresses: Addresses
  readonly apiKeys: ApiKeys
  readonly emails: Emails
  readonly threads: Threads
  readonly domains: Domains
  readonly mailboxes: Mailboxes
  readonly oauthApps: OauthApps
  readonly webhookEndpoints: WebhookEndpoints
  readonly events: Events
  readonly suppressions: Suppressions
  readonly pacingRules: PacingRules
  readonly pacing: Pacing
  readonly workspaces: Workspaces
  readonly members: Members
  readonly invitations: Invitations
  readonly attachments: Attachments

  constructor(options: ClientOptions = {}) {
    super(options, {
      "AIInbx-Workspace": options.workspaceId,
    })
    this.spaces = new Spaces(this)
    this.addresses = new Addresses(this)
    this.apiKeys = new ApiKeys(this)
    this.emails = new Emails(this)
    this.threads = new Threads(this)
    this.domains = new Domains(this)
    this.mailboxes = new Mailboxes(this)
    this.oauthApps = new OauthApps(this)
    this.webhookEndpoints = new WebhookEndpoints(this)
    this.events = new Events(this)
    this.suppressions = new Suppressions(this)
    this.pacingRules = new PacingRules(this)
    this.pacing = new Pacing(this)
    this.workspaces = new Workspaces(this)
    this.members = new Members(this)
    this.invitations = new Invitations(this)
    this.attachments = new Attachments(this)
  }
}
