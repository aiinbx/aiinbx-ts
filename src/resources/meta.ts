// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Meta extends APIResource {
  /**
   * Internal endpoint to expose webhook event schemas to SDK generators.
   */
  webhooksSchema(options?: RequestOptions): APIPromise<MetaWebhooksSchemaResponse> {
    return this._client.get('/_meta/webhooks', options);
  }
}

export type MetaWebhooksSchemaResponse =
  | MetaWebhooksSchemaResponse.InboundEmailReceivedEvent
  | MetaWebhooksSchemaResponse.OutboundDeliveredEvent
  | MetaWebhooksSchemaResponse.OutboundBouncedEvent
  | MetaWebhooksSchemaResponse.OutboundComplainedEvent
  | MetaWebhooksSchemaResponse.OutboundRejectedEvent
  | MetaWebhooksSchemaResponse.OutboundOpenedEvent
  | MetaWebhooksSchemaResponse.OutboundClickedEvent;

export namespace MetaWebhooksSchemaResponse {
  export interface InboundEmailReceivedEvent {
    attempt: number;

    data: InboundEmailReceivedEvent.Data;

    event: 'inbound.email.received';

    timestamp: number;
  }

  export namespace InboundEmailReceivedEvent {
    export interface Data {
      email: Data.Email;

      organization: Data.Organization;
    }

    export namespace Data {
      export interface Email {
        id: string;

        attachments: Array<Email.Attachment>;

        bccAddresses: Array<string>;

        ccAddresses: Array<string>;

        createdAt: string;

        direction: 'INBOUND' | 'OUTBOUND';

        fromAddress: string;

        messageId: string;

        references: Array<string>;

        replyToAddresses: Array<string>;

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

        threadId: string;

        toAddresses: Array<string>;

        fromName?: string | null;

        html?: string | null;

        inReplyToId?: string | null;

        receivedAt?: string | null;

        sentAt?: string | null;

        snippet?: string | null;

        strippedHtml?: string | null;

        strippedText?: string | null;

        subject?: string | null;

        text?: string | null;
      }

      export namespace Email {
        export interface Attachment {
          id: string;

          contentType: string;

          createdAt: string;

          expiresAt: string;

          fileName: string;

          signedUrl: string;

          sizeInBytes: number;

          cid?: string | null;

          disposition?: string | null;
        }
      }

      export interface Organization {
        id: string;

        slug: string;
      }
    }
  }

  export interface OutboundDeliveredEvent {
    attempt: number;

    data: OutboundDeliveredEvent.Data;

    event: 'outbound.email.delivered';

    timestamp: number;
  }

  export namespace OutboundDeliveredEvent {
    export interface Data {
      deliveredAt: string;

      messageId: string;

      recipients: Array<string>;

      emailId?: string;

      processingTimeMs?: number;

      remoteMtaIp?: string;

      smtpResponse?: string;
    }
  }

  export interface OutboundBouncedEvent {
    attempt: number;

    data: OutboundBouncedEvent.Data;

    event: 'outbound.email.bounced';

    timestamp: number;
  }

  export namespace OutboundBouncedEvent {
    export interface Data {
      bouncedAt: string;

      bounceType: 'Permanent' | 'Transient' | 'Undetermined';

      messageId: string;

      recipients: Array<Data.Recipient>;

      bounceSubType?: string;

      emailId?: string;
    }

    export namespace Data {
      export interface Recipient {
        emailAddress: string;

        action?: string;

        diagnosticCode?: string;

        status?: string;
      }
    }
  }

  export interface OutboundComplainedEvent {
    attempt: number;

    data: OutboundComplainedEvent.Data;

    event: 'outbound.email.complained';

    timestamp: number;
  }

  export namespace OutboundComplainedEvent {
    export interface Data {
      complainedAt: string;

      messageId: string;

      recipients: Array<string>;

      complaintFeedbackType?: string;

      emailId?: string;

      feedbackId?: string;

      userAgent?: string;
    }
  }

  export interface OutboundRejectedEvent {
    attempt: number;

    data: OutboundRejectedEvent.Data;

    event: 'outbound.email.rejected';

    timestamp: number;
  }

  export namespace OutboundRejectedEvent {
    export interface Data {
      messageId: string;

      rejectedAt: string;

      emailId?: string;

      reason?: string;
    }
  }

  export interface OutboundOpenedEvent {
    attempt: number;

    data: OutboundOpenedEvent.Data;

    event: 'outbound.email.opened';

    timestamp: number;
  }

  export namespace OutboundOpenedEvent {
    export interface Data {
      messageId: string;

      openedAt: string;

      emailId?: string;

      ipAddress?: string;

      userAgent?: string;
    }
  }

  export interface OutboundClickedEvent {
    attempt: number;

    data: OutboundClickedEvent.Data;

    event: 'outbound.email.clicked';

    timestamp: number;
  }

  export namespace OutboundClickedEvent {
    export interface Data {
      clickedAt: string;

      link: string;

      messageId: string;

      emailId?: string;

      ipAddress?: string;

      linkDomain?: string;

      userAgent?: string;
    }
  }
}

export declare namespace Meta {
  export { type MetaWebhooksSchemaResponse as MetaWebhooksSchemaResponse };
}
