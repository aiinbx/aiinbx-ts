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

export declare namespace Emails {
  export { type EmailRetrieveResponse as EmailRetrieveResponse };
}
