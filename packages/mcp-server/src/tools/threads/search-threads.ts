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
  httpPath: '/threads/search',
  operationId: 'searchThreads',
};

export const tool: Tool = {
  name: 'search_threads',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nSearch threads with various filtering options optimized for AI agents\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/thread_search_response',\n  $defs: {\n    thread_search_response: {\n      type: 'object',\n      properties: {\n        pagination: {\n          type: 'object',\n          properties: {\n            hasMore: {\n              type: 'boolean'\n            },\n            limit: {\n              type: 'number'\n            },\n            offset: {\n              type: 'number'\n            },\n            total: {\n              type: 'number'\n            }\n          },\n          required: [            'hasMore',\n            'limit',\n            'offset',\n            'total'\n          ]\n        },\n        threads: {\n          type: 'array',\n          items: {\n            type: 'object',\n            properties: {\n              id: {\n                type: 'string'\n              },\n              createdAt: {\n                type: 'string'\n              },\n              emailCount: {\n                type: 'number'\n              },\n              lastEmailAt: {\n                type: 'string'\n              },\n              participantEmails: {\n                type: 'array',\n                items: {\n                  type: 'string'\n                }\n              },\n              snippet: {\n                type: 'string'\n              },\n              subject: {\n                type: 'string'\n              },\n              updatedAt: {\n                type: 'string'\n              }\n            },\n            required: [              'id',\n              'createdAt',\n              'emailCount',\n              'lastEmailAt',\n              'participantEmails',\n              'snippet',\n              'subject',\n              'updatedAt'\n            ]\n          }\n        }\n      },\n      required: [        'pagination',\n        'threads'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      conversationState: {
        type: 'string',
        description: 'Filter threads by conversation state',
        enum: ['awaiting_reply', 'needs_reply', 'active', 'stale'],
      },
      createdAfter: {
        type: 'string',
        description: 'Filter threads created after this date',
      },
      createdBefore: {
        type: 'string',
        description: 'Filter threads created before this date',
      },
      hasEmailFromAddress: {
        type: 'string',
        description: 'Filter threads with emails from this address',
      },
      hasEmailToAddress: {
        type: 'string',
        description: 'Filter threads with emails to this address',
      },
      hasParticipantEmails: {
        type: 'array',
        description: 'Filter threads that include all of these email addresses as participants',
        items: {
          type: 'string',
        },
      },
      lastEmailAfter: {
        type: 'string',
        description: 'Filter threads with last email after this date',
      },
      lastEmailBefore: {
        type: 'string',
        description: 'Filter threads with last email before this date',
      },
      limit: {
        type: 'number',
        description: 'Number of threads to return (1-100)',
      },
      offset: {
        type: 'number',
        description: 'Number of threads to skip',
      },
      someEmailHasDirection: {
        type: 'string',
        description: 'Filter threads containing emails with this direction',
        enum: ['INBOUND', 'OUTBOUND'],
      },
      someEmailHasStatus: {
        type: 'string',
        description: 'Filter threads containing emails with this status',
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
        description: 'Field to sort by',
        enum: ['createdAt', 'lastEmailAt', 'subject'],
      },
      sortOrder: {
        type: 'string',
        description: 'Sort order',
        enum: ['asc', 'desc'],
      },
      staleThresholdDays: {
        type: 'number',
        description: 'Days to consider a thread stale (used with conversationState=stale)',
      },
      subjectContains: {
        type: 'string',
        description: 'Filter threads where subject contains this text',
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
  annotations: {},
};

export const handler = async (client: AIInbx, args: Record<string, unknown> | undefined) => {
  const { jq_filter, ...body } = args as any;
  try {
    return asTextContentResult(await maybeFilter(jq_filter, await client.threads.search(body)));
  } catch (error) {
    if (error instanceof AIInbx.APIError || isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
