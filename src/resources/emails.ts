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
  from: string;

  html: string;

  attachments?: Array<EmailReplyParams.Attachment>;

  bcc?: string | Array<string>;

  cc?: string | Array<string>;

  from_name?: string;

  is_draft?: boolean;

  reply_all?: boolean;

  subject?: string;

  text?: string;

  to?: string | Array<string>;
}

export namespace EmailReplyParams {
  export interface Attachment {
    content: string;

    file_name: string;

    cid?: string;

    content_type?: string;

    disposition?: 'attachment' | 'inline';
  }
}

export interface EmailSendParams {
  from: string;

  html: string;

  subject: string;

  to: string | Array<string>;

  attachments?: Array<EmailSendParams.Attachment>;

  bcc?: string | Array<string>;

  cc?: string | Array<string>;

  from_name?: string;

  in_reply_to?: string;

  is_draft?: boolean;

  references?: Array<string>;

  reply_to?: string | Array<string>;

  text?: string;

  threadId?: string;
}

export namespace EmailSendParams {
  export interface Attachment {
    content: string;

    file_name: string;

    cid?: string;

    content_type?: string;

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
