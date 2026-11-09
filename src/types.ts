/**
 * What only an SDK can say: a send with a React body. Everything on the wire,
 * the webhook events included, is in `generated/types.ts`.
 */
import type { SendEmailRequest } from "./generated/types.js"

/**
 * Anything React can render, such as `<WelcomeEmail />`, described by shape
 * so the SDK's types never need `react` installed.
 */
export type ReactEmailNode = SyncReactEmailNode | Promise<SyncReactEmailNode>

type SyncReactEmailNode =
  | { type: unknown; props: unknown }
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | Iterable<ReactEmailNode>

export interface SendEmailParams extends SendEmailRequest {
  /** A React Email component rendered to HTML before the request is sent. */
  react?: ReactEmailNode
}
