// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { isJqError, maybeFilter } from 'aiinbx-mcp/filtering';
import { Metadata, asErrorResult, asTextContentResult } from 'aiinbx-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import AIInbx from 'aiinbx';

export const metadata: Metadata = {
  resource: 'threads',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/threads/{threadId}/forward',
  operationId: 'forwardThread',
};

export const tool: Tool = {
  name: 'forward_threads',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nForward the entire thread as a readable transcript.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/thread_forward_response',\n  $defs: {\n    thread_forward_response: {\n      type: 'object',\n      properties: {\n        emailId: {\n          type: 'string'\n        },\n        messageId: {\n          type: 'string'\n        },\n        threadId: {\n          type: 'string'\n        }\n      },\n      required: [        'emailId',\n        'messageId',\n        'threadId'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      threadId: {
        type: 'string',
      },
      to: {
        anyOf: [
          {
            type: 'string',
          },
          {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        ],
      },
      attachments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
            },
            file_name: {
              type: 'string',
            },
            cid: {
              type: 'string',
            },
            content_type: {
              type: 'string',
            },
            disposition: {
              type: 'string',
              enum: ['attachment', 'inline'],
            },
          },
          required: ['content', 'file_name'],
        },
      },
      bcc: {
        anyOf: [
          {
            type: 'string',
          },
          {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        ],
      },
      cc: {
        anyOf: [
          {
            type: 'string',
          },
          {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        ],
      },
      from: {
        type: 'string',
      },
      from_name: {
        type: 'string',
      },
      includeAttachments: {
        type: 'boolean',
      },
      is_draft: {
        type: 'boolean',
      },
      note: {
        type: 'string',
      },
      track_clicks: {
        type: 'boolean',
      },
      track_opens: {
        type: 'boolean',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['threadId', 'to'],
  },
  annotations: {},
};

export const handler = async (client: AIInbx, args: Record<string, unknown> | undefined) => {
  const { threadId, jq_filter, ...body } = args as any;
  try {
    return asTextContentResult(await maybeFilter(jq_filter, await client.threads.forward(threadId, body)));
  } catch (error) {
    if (error instanceof AIInbx.APIError || isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
