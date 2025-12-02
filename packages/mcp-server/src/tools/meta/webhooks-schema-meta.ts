// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asErrorResult, asTextContentResult } from 'aiinbx-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import AIInbx from 'aiinbx';

export const metadata: Metadata = {
  resource: 'meta',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/_meta/webhooks',
};

export const tool: Tool = {
  name: 'webhooks_schema_meta',
  description: 'Internal endpoint to expose webhook event schemas to SDK generators.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: AIInbx, args: Record<string, unknown> | undefined) => {
  try {
    return asTextContentResult(await client.meta.webhooksSchema());
  } catch (error) {
    if (error instanceof AIInbx.APIError) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
