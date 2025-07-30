import type { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import type { EmailRetrieveResponse } from '../../resources';

/**
 * Generic helper response type used throughout the helpers.
 */
export type HandlerReturn = NextResponse | Promise<NextResponse>;

/* -------------------------------------------------------------------------- */
/*                             Event Type Models                              */
/* -------------------------------------------------------------------------- */

/** Base shape shared by all webhook events */
export type WebhookDataBase = {
  event: string;
  attempt: number;
  timestamp: string;
  data: unknown;
};

/* -------------------- Specific event – inbound email ---------------------- */
export type InboundEmailEventData = {
  email: EmailRetrieveResponse;
};

export type InboundEmailEvent = {
  event: 'inbound.email.received';
  data: InboundEmailEventData;
  attempt: number;
  timestamp: string;
};

/* -------------------------------------------------------------------------- */
/*                         Handler & Helper Definitions                       */
/* -------------------------------------------------------------------------- */

export type HandlerParams<T = WebhookDataBase> = {
  payload: T;
  /**
   * When `AI_INBX_SECRET` is present we validate the request signature.
   *  - `true`  => signature valid
   *  - `false` => signature invalid
   *  - `undefined` => no secret, hence not verified
   */
  isVerified: boolean | undefined;
  request: NextRequest;
  rawBody: string;
};

export type InboundEmailHandler = (params: HandlerParams<InboundEmailEvent>) => HandlerReturn;

/** Collection of available event handlers */
export type EventHandlers = {
  onInboundEmail?: InboundEmailHandler;
  // Future events should be added here, e.g.:
  // onOutboundEmail?: OutboundEmailHandler
};

/**
 * Mapping between the raw `event` string coming from the webhook payload and
 * the key inside `EventHandlers` provided by the consumer.
 */
const EVENT_HANDLER_MAP = {
  'inbound.email.received': 'onInboundEmail',
} as const satisfies Record<string, keyof EventHandlers>;

/* -------------------------------------------------------------------------- */
/*                           Utility Functions                                */
/* -------------------------------------------------------------------------- */

const verifySignature = (request: NextRequest, rawBody: string, secret: string): boolean => {
  const timestamp = request.headers.get('x-aiinbx-timestamp') || '';
  const signature = request.headers.get('x-aiinbx-signature') || '';

  const expected =
    'sha256=' + crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};

/**
 * Fallback JSON response helper in case `NextResponse` is not available at
 * runtime (e.g. when this package is executed in a non-Next.js environment).
 */

const jsonResponse = (body: any, init?: ResponseInit) => {
  // Dynamically try to use the real NextResponse if it exists.
  try {
    const { NextResponse } = require('next/server') as typeof import('next/server');
    return NextResponse.json(body, init);
  } catch {
    return new Response(JSON.stringify(body), {
      headers: { 'content-type': 'application/json' },
      ...init,
    }) as unknown as NextResponse;
  }
};

/* -------------------------------------------------------------------------- */
/*                       Public Helper – entry-point                          */
/* -------------------------------------------------------------------------- */

/**
 * Creates a Next.js route handler (`POST` export) that automatically verifies
 * the AI Inbx webhook signature (when `AI_INBX_SECRET` is provided) and routes
 * the incoming event to the matching handler supplied by the user.
 */
export const createNextRouteHandler = (handlers: EventHandlers) => {
  return async (request: NextRequest): Promise<NextResponse> => {
    const rawBody = await request.text();

    // Signature verification -------------------------------------------------
    const secret = process.env['AI_INBX_SECRET'];
    let isVerified: boolean | undefined;

    if (secret) {
      isVerified = verifySignature(request, rawBody, secret);
    }

    // Parse payload ----------------------------------------------------------
    let payload: WebhookDataBase;
    try {
      payload = JSON.parse(rawBody) as WebhookDataBase;
    } catch {
      return jsonResponse({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // Resolve handler --------------------------------------------------------
    const handlerKey = EVENT_HANDLER_MAP[payload.event as keyof typeof EVENT_HANDLER_MAP];
    if (!handlerKey) {
      return jsonResponse({ error: `Unknown event: ${payload.event}` }, { status: 400 });
    }

    const handler = handlers[handlerKey];
    if (!handler) {
      return jsonResponse({ error: `No handler for event: ${payload.event}` }, { status: 400 });
    }

    // Invoke handler ---------------------------------------------------------
    // We cast payload to the correct event type based on handlerKey.
    // This is safe because handlerKey was derived from payload.event.

    return (handler as any)({
      payload: payload as any,
      isVerified,
      request,
      rawBody,
    });
  };
};
