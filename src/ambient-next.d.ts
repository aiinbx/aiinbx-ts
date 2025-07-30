/*
 * Minimal fallback types for `next/server` so that this package can be used
 * in non-Next.js projects without adding a hard dependency on `@types/next`.
 *
 * When a consuming application already has `next` installed, the declaration
 * below will be merged with the real one provided by Next.js. We only declare
 * the parts that we actually use, so there should be no conflicts.
 */

// Only declare the module if it doesn't already exist.

declare module 'next/server' {
  export interface NextRequest extends Request {
    /** Get header value */
    headers: Headers;
    clone(): NextRequest;
  }

  // A very small subset of the real NextResponse API. We only expose the
  // methods that the helper requires.
  export class NextResponse<T = unknown> extends Response {
    static json<U>(data: U, init?: ResponseInit): NextResponse<U>;
  }
}
