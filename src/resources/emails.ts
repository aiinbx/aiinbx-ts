// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Emails extends APIResource {
  /**
   * Retrieve a specific email by its ID using API key authentication
   */
  retrieve(emailID: string, options?: RequestOptions): APIPromise<EmailRetrieveResponse> {
    return this._client.get(path`/emails/${emailID}`, options);
  }

  /**
   * Reply to an existing email. Automatically handles reply headers (In-Reply-To,
   * References) and thread association. The reply will be sent from a verified
   * domain belonging to the organization.
   */
  reply(emailID: string, body: EmailReplyParams, options?: RequestOptions): APIPromise<EmailReplyResponse> {
    return this._client.post(path`/emails/${emailID}/reply`, { body, ...options });
  }

  /**
   * Send an email from a verified domain belonging to the organization. Useful for
   * transactional or conversational messages. Returns metadata including identifiers
   * for further queries.
   */
  send(body: EmailSendParams, options?: RequestOptions): APIPromise<EmailSendResponse> {
    return this._client.post('/emails/send', { body, ...options });
  }
}

export interface EmailRetrieveResponse {
  id: string;

  attachments: Array<EmailRetrieveResponse.Attachment>;

  bccAddresses: Array<string>;

  ccAddresses: Array<string>;

  createdAt: string;

  direction: 'INBOUND' | 'OUTBOUND';

  fromAddress: string;

  fromName: string | null;

  html: string | null;

  inReplyToId: string | null;

  messageId: string;

  receivedAt: string | null;

  references: Array<string>;

  replyToAddresses: Array<string>;

  sentAt: string | null;

  snippet: string | null;

  status:
    | 'DRAFT'
    | 'QUEUED'
    | 'ACCEPTED'
    | 'SENT'
    | 'RECEIVED'
    | 'FAILED'
    | 'BOUNCED'
    | 'COMPLAINED'
    | 'REJECTED'
    | 'READ'
    | 'ARCHIVED';

  strippedHtml: string | null;

  strippedText: string | null;

  subject: string | null;

  text: string | null;

  threadId: string;

  toAddresses: Array<string>;
}

export namespace EmailRetrieveResponse {
  export interface Attachment {
    id: string;

    cid: string | null;

    contentType: string;

    createdAt: string;

    disposition: string | null;

    expiresAt: string;

    fileName: string;

    signedUrl: string;

    sizeInBytes: number;
  }
}

export interface EmailReplyResponse {
  emailId: string;

  messageId: string;

  threadId: string;
}

export interface EmailSendResponse {
  emailId: string;

  messageId: string;

  threadId: string;
}

export interface EmailReplyParams {
  /**
   * Sender email address (must use a verified domain)
   */
  from: string;

  /**
   * HTML body of the reply
   */
  html: string;

  /**
   * Optional list of attachments to include with this reply (e.g., inline images via
   * cid).
   */
  attachments?: Array<EmailReplyParams.Attachment>;

  /**
   * Optional BCC recipients
   */
  bcc?: string | Array<string>;

  /**
   * Optional CC recipients
   */
  cc?: string | Array<string>;

  /**
   * Optional display name for the sender
   */
  from_name?: string;

  /**
   * If true, the email is a draft
   */
  is_draft?: boolean;

  /**
   * If true, includes all original recipients (to/cc) in the reply
   */
  reply_all?: boolean;

  /**
   * Email subject. If not provided, uses "Re: " + original subject
   */
  subject?: string;

  /**
   * Optional plain-text body of the reply
   */
  text?: string;

  /**
   * Override recipient addresses. If not provided, replies to the original sender
   * and any reply-to addresses.
   */
  to?: string | Array<string>;

  /**
   * Enable click tracking for this email. Overrides API key and org defaults.
   */
  track_clicks?: boolean;

  /**
   * Enable open tracking for this email. Overrides API key and org defaults.
   */
  track_opens?: boolean;
}

export namespace EmailReplyParams {
  /**
   * Attachment input; provide content as base64 or data URL
   */
  export interface Attachment {
    /**
     * Required: base64 string or data URL for the file content
     */
    content: string;

    /**
     * Original file name to display
     */
    file_name: string;

    /**
     * Content-ID for inline images referenced via cid:
     */
    cid?: string;

    /**
     * MIME type when using raw base64 (ignored for data URLs)
     */
    content_type?: string;

    /**
     * How the attachment should be presented
     */
    disposition?: 'attachment' | 'inline';
  }
}

export interface EmailSendParams {
  /**
   * Sender email address (must use a verified domain)
   */
  from: string;

  /**
   * HTML body of the email
   */
  html: string;

  /**
   * Email subject
   */
  subject: string;

  /**
   * Recipient email address or list of addresses
   */
  to: string | Array<string>;

  /**
   * Optional list of attachments. Supports base64 or data URL; use cid for inline.
   */
  attachments?: Array<EmailSendParams.Attachment>;

  /**
   * Optional BCC recipients
   */
  bcc?: string | Array<string>;

  /**
   * Optional CC recipients
   */
  cc?: string | Array<string>;

  /**
   * Optional display name for the sender
   */
  from_name?: string;

  /**
   * Optional Message-ID of the email being replied to
   */
  in_reply_to?: string;

  /**
   * If true, the email is a draft
   */
  is_draft?: boolean;

  /**
   * Optional list of Message-ID references
   */
  references?: Array<string>;

  /**
   * Optional Reply-To addresses
   */
  reply_to?: string | Array<string>;

  /**
   * Optional plain-text body of the email
   */
  text?: string;

  /**
   * Optional existing thread ID to attach this email to
   */
  threadId?: string;

  /**
   * Enable click tracking for this email. Overrides API key and org defaults.
   */
  track_clicks?: boolean;

  /**
   * Enable open tracking for this email. Overrides API key and org defaults.
   */
  track_opens?: boolean;
}

export namespace EmailSendParams {
  /**
   * Attachment input; provide content as base64 or data URL
   */
  export interface Attachment {
    /**
     * Required: base64 string or data URL for the file content
     */
    content: string;

    /**
     * Original file name to display
     */
    file_name: string;

    /**
     * Content-ID for inline images referenced via cid:
     */
    cid?: string;

    /**
     * MIME type when using raw base64 (ignored for data URLs)
     */
    content_type?: string;

    /**
     * How the attachment should be presented
     */
    disposition?: 'attachment' | 'inline';
  }
}

export declare namespace Emails {
  export {
    type EmailRetrieveResponse as EmailRetrieveResponse,
    type EmailReplyResponse as EmailReplyResponse,
    type EmailSendResponse as EmailSendResponse,
    type EmailReplyParams as EmailReplyParams,
    type EmailSendParams as EmailSendParams,
  };
}
