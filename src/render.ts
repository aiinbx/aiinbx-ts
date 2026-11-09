import type { ReactEmailNode } from "./types.js"

export async function renderReactEmail(node: ReactEmailNode): Promise<string> {
  let render: typeof import("@react-email/render").render

  try {
    const renderer = await import("@react-email/render")
    render = renderer.render
  } catch {
    throw new Error(
      "Failed to render React email. Install `@react-email/render`."
    )
  }

  // The shape stands in for React's own node type, which it mirrors.
  return render(node as Parameters<typeof render>[0])
}
