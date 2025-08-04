// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'aiinbx-mcp/filtering';
import { Metadata, asTextContentResult } from 'aiinbx-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import AIInbx from 'aiinbx';

export const metadata: Metadata = {
  resource: 'emails',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/emails/send',
  operationId: 'sendEmail',
};

export const tool: Tool = {
  name: 'send_emails',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nSend an email from a verified domain belonging to the organization. Useful for transactional or conversational messages. Returns metadata including identifiers for further queries.\n\n# Response Schema\n```json\n{\n  type: 'object',\n  properties: {\n    emailId: {\n      type: 'string'\n    },\n    messageId: {\n      type: 'string'\n    },\n    threadId: {\n      type: 'string'\n    }\n  },\n  required: [    'emailId',\n    'messageId',\n    'threadId'\n  ]\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      from: {
        type: 'string',
      },
      html: {
        type: 'string',
      },
      subject: {
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
      from_name: {
        type: 'string',
      },
      in_reply_to: {
        type: 'string',
      },
      is_draft: {
        type: 'boolean',
      },
      references: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      reply_to: {
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
      text: {
        type: 'string',
      },
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
    required: ['from', 'html', 'subject', 'to'],
  },
  annotations: {},
};

export const handler = async (client: AIInbx, args: Record<string, unknown> | undefined) => {
  const { jq_filter, ...body } = args as any;
  return asTextContentResult(await maybeFilter(jq_filter, await client.emails.send(body)));
};

export default { metadata, tool, handler };
