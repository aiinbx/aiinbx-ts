// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'aiinbx-mcp/filtering';
import { Metadata, asTextContentResult } from 'aiinbx-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import AIInbx from 'aiinbx';

export const metadata: Metadata = {
  resource: 'domains',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/domains',
  operationId: 'createDomain',
};

export const tool: Tool = {
  name: 'create_domains',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nCreate a new domain for the organization and return required DNS records to configure.\n\n# Response Schema\n```json\n{\n  type: 'object',\n  properties: {\n    domainId: {\n      type: 'string'\n    },\n    records: {\n      type: 'array',\n      items: {\n        type: 'object',\n        properties: {\n          name: {\n            type: 'string'\n          },\n          type: {\n            type: 'string',\n            enum: [              'TXT',\n              'CNAME',\n              'MX'\n            ]\n          },\n          value: {\n            type: 'string'\n          },\n          priority: {\n            type: 'number'\n          }\n        },\n        required: [          'name',\n          'type',\n          'value'\n        ]\n      }\n    }\n  },\n  required: [    'domainId',\n    'records'\n  ]\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      domain: {
        type: 'string',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['domain'],
  },
  annotations: {},
};

export const handler = async (client: AIInbx, args: Record<string, unknown> | undefined) => {
  const { jq_filter, ...body } = args as any;
  return asTextContentResult(await maybeFilter(jq_filter, await client.domains.create(body)));
};

export default { metadata, tool, handler };
