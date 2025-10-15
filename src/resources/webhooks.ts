// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';

export class Webhooks extends APIResource {
  unwrap(body: string): UnwrapWebhookEvent {
    return JSON.parse(body) as UnwrapWebhookEvent;
  }
}

export interface InboundEmailReceivedWebhookEvent {
  attempt: number;

  data: InboundEmailReceivedWebhookEvent.Data;

  event: 'inbound.email.received';

  timestamp: number;
}

export namespace InboundEmailReceivedWebhookEvent {
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

export interface OutboundEmailDeliveredWebhookEvent {
  attempt: number;

  data: OutboundEmailDeliveredWebhookEvent.Data;

  event: 'outbound.email.delivered';

  timestamp: number;
}

export namespace OutboundEmailDeliveredWebhookEvent {
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

export interface OutboundEmailBouncedWebhookEvent {
  attempt: number;

  data: OutboundEmailBouncedWebhookEvent.Data;

  event: 'outbound.email.bounced';

  timestamp: number;
}

export namespace OutboundEmailBouncedWebhookEvent {
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

export interface OutboundEmailComplainedWebhookEvent {
  attempt: number;

  data: OutboundEmailComplainedWebhookEvent.Data;

  event: 'outbound.email.complained';

  timestamp: number;
}

export namespace OutboundEmailComplainedWebhookEvent {
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

export interface OutboundEmailRejectedWebhookEvent {
  attempt: number;

  data: OutboundEmailRejectedWebhookEvent.Data;

  event: 'outbound.email.rejected';

  timestamp: number;
}

export namespace OutboundEmailRejectedWebhookEvent {
  export interface Data {
    messageId: string;

    rejectedAt: string;

    emailId?: string;

    reason?: string;
  }
}

export interface OutboundEmailOpenedWebhookEvent {
  attempt: number;

  data: OutboundEmailOpenedWebhookEvent.Data;

  event: 'outbound.email.opened';

  timestamp: number;
}

export namespace OutboundEmailOpenedWebhookEvent {
  export interface Data {
    messageId: string;

    openedAt: string;

    emailId?: string;

    ipAddress?: string;

    userAgent?: string;
  }
}

export interface OutboundEmailClickedWebhookEvent {
  attempt: number;

  data: OutboundEmailClickedWebhookEvent.Data;

  event: 'outbound.email.clicked';

  timestamp: number;
}

export namespace OutboundEmailClickedWebhookEvent {
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

export type UnwrapWebhookEvent =
  | InboundEmailReceivedWebhookEvent
  | OutboundEmailDeliveredWebhookEvent
  | OutboundEmailBouncedWebhookEvent
  | OutboundEmailComplainedWebhookEvent
  | OutboundEmailRejectedWebhookEvent
  | OutboundEmailOpenedWebhookEvent
  | OutboundEmailClickedWebhookEvent;

export declare namespace Webhooks {
  export {
    type InboundEmailReceivedWebhookEvent as InboundEmailReceivedWebhookEvent,
    type OutboundEmailDeliveredWebhookEvent as OutboundEmailDeliveredWebhookEvent,
    type OutboundEmailBouncedWebhookEvent as OutboundEmailBouncedWebhookEvent,
    type OutboundEmailComplainedWebhookEvent as OutboundEmailComplainedWebhookEvent,
    type OutboundEmailRejectedWebhookEvent as OutboundEmailRejectedWebhookEvent,
    type OutboundEmailOpenedWebhookEvent as OutboundEmailOpenedWebhookEvent,
    type OutboundEmailClickedWebhookEvent as OutboundEmailClickedWebhookEvent,
    type UnwrapWebhookEvent as UnwrapWebhookEvent,
  };
}
