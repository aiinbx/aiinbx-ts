// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'ai-inbx-mcp/filtering';
import { Metadata, asTextContentResult } from 'ai-inbx-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import AIInbx from 'ai-inbx';

export const metadata: Metadata = {
  resource: 'threads',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/threads/search',
  operationId: 'searchThreads',
};

export const tool: Tool = {
  name: 'search_threads',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nSearch threads with various filtering options optimized for AI agents\n\n# Response Schema\n```json\n{\n  type: 'object',\n  properties: {\n    pagination: {\n      type: 'object',\n      properties: {\n        hasMore: {\n          type: 'boolean'\n        },\n        limit: {\n          type: 'number'\n        },\n        offset: {\n          type: 'number'\n        },\n        total: {\n          type: 'number'\n        }\n      },\n      required: [        'hasMore',\n        'limit',\n        'offset',\n        'total'\n      ]\n    },\n    threads: {\n      type: 'array',\n      items: {\n        type: 'object',\n        properties: {\n          id: {\n            type: 'string'\n          },\n          createdAt: {\n            type: 'string'\n          },\n          emailCount: {\n            type: 'number'\n          },\n          lastEmailAt: {\n            type: 'string'\n          },\n          participantEmails: {\n            type: 'array',\n            items: {\n              type: 'string'\n            }\n          },\n          snippet: {\n            type: 'string'\n          },\n          subject: {\n            type: 'string'\n          },\n          updatedAt: {\n            type: 'string'\n          }\n        },\n        required: [          'id',\n          'createdAt',\n          'emailCount',\n          'lastEmailAt',\n          'participantEmails',\n          'snippet',\n          'subject',\n          'updatedAt'\n        ]\n      }\n    }\n  },\n  required: [    'pagination',\n    'threads'\n  ]\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      conversationState: {
        type: 'string',
        enum: ['awaiting_reply', 'needs_reply', 'active', 'stale'],
      },
      createdAfter: {
        type: 'string',
      },
      createdBefore: {
        type: 'string',
      },
      hasEmailFromAddress: {
        type: 'string',
      },
      hasEmailToAddress: {
        type: 'string',
      },
      hasParticipantEmails: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      lastEmailAfter: {
        type: 'string',
      },
      lastEmailBefore: {
        type: 'string',
      },
      limit: {
        type: 'number',
      },
      offset: {
        type: 'number',
      },
      someEmailHasDirection: {
        type: 'string',
        enum: ['INBOUND', 'OUTBOUND'],
      },
      someEmailHasStatus: {
        type: 'string',
        enum: [
          'DRAFT',
          'QUEUED',
          'ACCEPTED',
          'SENT',
          'RECEIVED',
          'FAILED',
          'BOUNCED',
          'COMPLAINED',
          'REJECTED',
          'READ',
          'ARCHIVED',
        ],
      },
      sortBy: {
        type: 'string',
        enum: ['createdAt', 'lastEmailAt', 'subject'],
      },
      sortOrder: {
        type: 'string',
        enum: ['asc', 'desc'],
      },
      staleThresholdDays: {
        type: 'number',
      },
      subjectContains: {
        type: 'string',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: [],
  },
};

export const handler = async (client: AIInbx, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await maybeFilter(args, await client.threads.search(body)));
};

export default { metadata, tool, handler };
