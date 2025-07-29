// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'aiinbx-mcp/filtering';
import { Metadata, asTextContentResult } from 'aiinbx-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import AIInbx from 'aiinbx';

export const metadata: Metadata = {
  resource: 'threads',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/threads/{threadId}',
  operationId: 'getThread',
};

export const tool: Tool = {
  name: 'retrieve_threads',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nRetrieve a specific thread with all its emails by thread ID using API key authentication\n\n# Response Schema\n```json\n{\n  type: 'object',\n  properties: {\n    id: {\n      type: 'string'\n    },\n    createdAt: {\n      type: 'string'\n    },\n    emails: {\n      type: 'array',\n      items: {\n        type: 'object',\n        properties: {\n          id: {\n            type: 'string'\n          },\n          attachments: {\n            type: 'array',\n            items: {\n              type: 'object',\n              properties: {\n                id: {\n                  type: 'string'\n                },\n                cid: {\n                  type: 'string'\n                },\n                contentType: {\n                  type: 'string'\n                },\n                createdAt: {\n                  type: 'string'\n                },\n                disposition: {\n                  type: 'string'\n                },\n                expiresAt: {\n                  type: 'string'\n                },\n                fileName: {\n                  type: 'string'\n                },\n                signedUrl: {\n                  type: 'string'\n                },\n                sizeInBytes: {\n                  type: 'number'\n                }\n              },\n              required: [                'id',\n                'cid',\n                'contentType',\n                'createdAt',\n                'disposition',\n                'expiresAt',\n                'fileName',\n                'signedUrl',\n                'sizeInBytes'\n              ]\n            }\n          },\n          bccAddresses: {\n            type: 'array',\n            items: {\n              type: 'string'\n            }\n          },\n          ccAddresses: {\n            type: 'array',\n            items: {\n              type: 'string'\n            }\n          },\n          createdAt: {\n            type: 'string'\n          },\n          direction: {\n            type: 'string',\n            enum: [              'INBOUND',\n              'OUTBOUND'\n            ]\n          },\n          fromAddress: {\n            type: 'string'\n          },\n          fromName: {\n            type: 'string'\n          },\n          html: {\n            type: 'string'\n          },\n          inReplyToId: {\n            type: 'string'\n          },\n          messageId: {\n            type: 'string'\n          },\n          receivedAt: {\n            type: 'string'\n          },\n          references: {\n            type: 'array',\n            items: {\n              type: 'string'\n            }\n          },\n          replyToAddresses: {\n            type: 'array',\n            items: {\n              type: 'string'\n            }\n          },\n          sentAt: {\n            type: 'string'\n          },\n          snippet: {\n            type: 'string'\n          },\n          status: {\n            type: 'string',\n            enum: [              'DRAFT',\n              'QUEUED',\n              'ACCEPTED',\n              'SENT',\n              'RECEIVED',\n              'FAILED',\n              'BOUNCED',\n              'COMPLAINED',\n              'REJECTED',\n              'READ',\n              'ARCHIVED'\n            ]\n          },\n          strippedHtml: {\n            type: 'string'\n          },\n          strippedText: {\n            type: 'string'\n          },\n          subject: {\n            type: 'string'\n          },\n          text: {\n            type: 'string'\n          },\n          threadId: {\n            type: 'string'\n          },\n          toAddresses: {\n            type: 'array',\n            items: {\n              type: 'string'\n            }\n          }\n        },\n        required: [          'id',\n          'attachments',\n          'bccAddresses',\n          'ccAddresses',\n          'createdAt',\n          'direction',\n          'fromAddress',\n          'fromName',\n          'html',\n          'inReplyToId',\n          'messageId',\n          'receivedAt',\n          'references',\n          'replyToAddresses',\n          'sentAt',\n          'snippet',\n          'status',\n          'strippedHtml',\n          'strippedText',\n          'subject',\n          'text',\n          'threadId',\n          'toAddresses'\n        ]\n      }\n    },\n    subject: {\n      type: 'string'\n    }\n  },\n  required: [    'id',\n    'createdAt',\n    'emails',\n    'subject'\n  ]\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      threadId: {
        type: 'string',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['threadId'],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: AIInbx, args: Record<string, unknown> | undefined) => {
  const { threadId, ...body } = args as any;
  return asTextContentResult(await maybeFilter(args, await client.threads.retrieve(threadId)));
};

export default { metadata, tool, handler };
