// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Threads extends APIResource {
  /**
   * Retrieve a specific thread with all its emails by thread ID using API key
   * authentication
   */
  retrieve(threadID: string, options?: RequestOptions): APIPromise<ThreadRetrieveResponse> {
    return this._client.get(path`/threads/${threadID}`, options);
  }

  /**
   * Search threads with various filtering options optimized for AI agents
   */
  search(body: ThreadSearchParams, options?: RequestOptions): APIPromise<ThreadSearchResponse> {
    return this._client.post('/threads/search', { body, ...options });
  }
}

export interface ThreadRetrieveResponse {
  id: string;

  createdAt: string;

  emails: Array<ThreadRetrieveResponse.Email>;

  subject: string | null;
}

export namespace ThreadRetrieveResponse {
  export interface Email {
    id: string;

    attachments: Array<Email.Attachment>;

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

  export namespace Email {
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
}

export interface ThreadSearchResponse {
  pagination: ThreadSearchResponse.Pagination;

  threads: Array<ThreadSearchResponse.Thread>;
}

export namespace ThreadSearchResponse {
  export interface Pagination {
    hasMore: boolean;

    limit: number;

    offset: number;

    total: number;
  }

  export interface Thread {
    id: string;

    createdAt: string;

    emailCount: number;

    lastEmailAt: string | null;

    participantEmails: Array<string>;

    snippet: string | null;

    subject: string | null;

    updatedAt: string;
  }
}

export interface ThreadSearchParams {
  conversationState?: 'awaiting_reply' | 'needs_reply' | 'active' | 'stale';

  createdAfter?: string;

  createdBefore?: string;

  hasEmailFromAddress?: string;

  hasEmailToAddress?: string;

  hasParticipantEmails?: Array<string>;

  lastEmailAfter?: string;

  lastEmailBefore?: string;

  limit?: number;

  offset?: number;

  someEmailHasDirection?: 'INBOUND' | 'OUTBOUND';

  someEmailHasStatus?:
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

  sortBy?: 'createdAt' | 'lastEmailAt' | 'subject';

  sortOrder?: 'asc' | 'desc';

  staleThresholdDays?: number;

  subjectContains?: string;
}

export declare namespace Threads {
  export {
    type ThreadRetrieveResponse as ThreadRetrieveResponse,
    type ThreadSearchResponse as ThreadSearchResponse,
    type ThreadSearchParams as ThreadSearchParams,
  };
}
