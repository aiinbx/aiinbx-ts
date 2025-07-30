import crypto from 'node:crypto';
import { EmailRetrieveResponse } from '../resources';

// Import types conditionally - they'll be available when used in Next.js projects
type NextRequest = {
  text(): Promise<string>;
  headers: {
    get(name: string): string | null;
  };
};

type NextResponse = {
  json(body: any, init?: { status?: number }): NextResponse;
};

type WebhookData = {
  event: string;
  data: any;
  attempt: number;
  timestamp: string;
};

// Specific event data types
type InboundEmailEventData = {
  email: EmailRetrieveResponse;
};

type InboundEmailEvent = {
  event: 'inbound.email.received';
  data: InboundEmailEventData;
  attempt: number;
  timestamp: string;
};

type HandlerParams<T = WebhookData> = {
  payload: T;
  isVerified: boolean | undefined;
  request: NextRequest;
  rawBody: string;
};

type InboundEmailHandler = (params: HandlerParams<InboundEmailEvent>) => Promise<NextResponse> | NextResponse;

// Type-safe event handlers
type EventHandlers = {
  onInboundEmail?: InboundEmailHandler;
  // Add more event types as they become available
  // onOutboundEmail?: EventHandler
  // onEmailBounce?: EventHandler
};

// Map event names to handler method names
const EVENT_HANDLER_MAP = {
  'inbound.email.received': 'onInboundEmail',
  // Add more mappings as events are added
} as const;

const verifySignature = (request: NextRequest, rawBody: string, secret: string): boolean => {
  const timestamp = request.headers.get('x-aiinbx-timestamp') || '';
  const signature = request.headers.get('x-aiinbx-signature') || '';

  const expected =
    'sha256=' + crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};

export const createNextRouteHandler = (handlers: EventHandlers) => {
  return async (request: NextRequest): Promise<NextResponse> => {
    const rawBody = await request.text();
    const AI_INBX_SECRET = process.env['AI_INBX_SECRET'];

    let isVerified: boolean | undefined = undefined;

    // Only verify if secret is available
    if (AI_INBX_SECRET) {
      isVerified = verifySignature(request, rawBody, AI_INBX_SECRET);
    }

    let payload: WebhookData;
    try {
      payload = JSON.parse(rawBody);
    } catch (error) {
      // In actual Next.js usage, NextResponse will be imported
      const NextResponse = (globalThis as any).NextResponse || {
        json: (body: any, init?: any) => ({ body, ...init }),
      };
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // Map event to handler method name
    const handlerMethodName = EVENT_HANDLER_MAP[payload.event as keyof typeof EVENT_HANDLER_MAP];
    if (!handlerMethodName) {
      const NextResponse = (globalThis as any).NextResponse || {
        json: (body: any, init?: any) => ({ body, ...init }),
      };
      return NextResponse.json({ error: `Unknown event: ${payload.event}` }, { status: 400 });
    }

    // Get the handler function
    const handler = handlers[handlerMethodName as keyof EventHandlers];
    if (!handler) {
      const NextResponse = (globalThis as any).NextResponse || {
        json: (body: any, init?: any) => ({ body, ...init }),
      };
      return NextResponse.json({ error: `No handler for event: ${payload.event}` }, { status: 400 });
    }

    return handler({
      payload: payload as any, // Type assertion needed here due to event mapping
      isVerified,
      request,
      rawBody,
    });
  };
};
