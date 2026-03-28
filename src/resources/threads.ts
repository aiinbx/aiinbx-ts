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
   * Forward the entire thread as a readable transcript.
   */
  forward(
    threadID: string,
    body: ThreadForwardParams,
    options?: RequestOptions,
  ): APIPromise<ThreadForwardResponse> {
    return this._client.post(path`/threads/${threadID}/forward`, { body, ...options });
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

export interface ThreadForwardResponse {
  emailId: string;

  messageId: string;

  threadId: string;
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

export interface ThreadForwardParams {
  to: string | Array<string>;

  attachments?: Array<ThreadForwardParams.Attachment>;

  bcc?: string | Array<string>;

  cc?: string | Array<string>;

  from?: string;

  from_name?: string;

  includeAttachments?: boolean;

  is_draft?: boolean;

  note?: string;

  track_clicks?: boolean;

  track_opens?: boolean;
}

export namespace ThreadForwardParams {
  export interface Attachment {
    content: string;

    file_name: string;

    cid?: string;

    content_type?: string;

    disposition?: 'attachment' | 'inline';
  }
}

export interface ThreadSearchParams {
  /**
   * Filter threads by conversation state
   */
  conversationState?: 'awaiting_reply' | 'needs_reply' | 'active' | 'stale';

  /**
   * Filter threads created after this date
   */
  createdAfter?: string;

  /**
   * Filter threads created before this date
   */
  createdBefore?: string;

  /**
   * Filter threads with emails from this address
   */
  hasEmailFromAddress?: string;

  /**
   * Filter threads with emails to this address
   */
  hasEmailToAddress?: string;

  /**
   * Filter threads that include all of these email addresses as participants
   */
  hasParticipantEmails?: Array<string>;

  /**
   * Filter threads with last email after this date
   */
  lastEmailAfter?: string;

  /**
   * Filter threads with last email before this date
   */
  lastEmailBefore?: string;

  /**
   * Number of threads to return (1-100)
   */
  limit?: number;

  /**
   * Number of threads to skip
   */
  offset?: number;

  /**
   * Filter threads containing emails with this direction
   */
  someEmailHasDirection?: 'INBOUND' | 'OUTBOUND';

  /**
   * Filter threads containing emails with this status
   */
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

  /**
   * Field to sort by
   */
  sortBy?: 'createdAt' | 'lastEmailAt' | 'subject';

  /**
   * Sort order
   */
  sortOrder?: 'asc' | 'desc';

  /**
   * Days to consider a thread stale (used with conversationState=stale)
   */
  staleThresholdDays?: number;

  /**
   * Filter threads where subject contains this text
   */
  subjectContains?: string;
}

export declare namespace Threads {
  export {
    type ThreadRetrieveResponse as ThreadRetrieveResponse,
    type ThreadForwardResponse as ThreadForwardResponse,
    type ThreadSearchResponse as ThreadSearchResponse,
    type ThreadForwardParams as ThreadForwardParams,
    type ThreadSearchParams as ThreadSearchParams,
  };
}
