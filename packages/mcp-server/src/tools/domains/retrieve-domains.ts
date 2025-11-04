// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'aiinbx-mcp/filtering';
import { Metadata, asTextContentResult } from 'aiinbx-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import AIInbx from 'aiinbx';

export const metadata: Metadata = {
  resource: 'domains',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/domains/{domainId}',
  operationId: 'getDomain',
};

export const tool: Tool = {
  name: 'retrieve_domains',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nRetrieve a domain by its ID\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/domain_retrieve_response',\n  $defs: {\n    domain_retrieve_response: {\n      type: 'object',\n      properties: {\n        id: {\n          type: 'string'\n        },\n        createdAt: {\n          type: 'string'\n        },\n        domain: {\n          type: 'string'\n        },\n        isManagedDefault: {\n          type: 'boolean'\n        },\n        status: {\n          type: 'string',\n          enum: [            'VERIFIED',\n            'PENDING_VERIFICATION',\n            'NOT_REGISTERED'\n          ]\n        },\n        updatedAt: {\n          type: 'string'\n        },\n        verifiedAt: {\n          type: 'string'\n        },\n        dnsRecords: {\n          type: 'array',\n          items: {\n            type: 'object',\n            properties: {\n              name: {\n                type: 'string'\n              },\n              type: {\n                type: 'string',\n                enum: [                  'TXT',\n                  'CNAME',\n                  'MX'\n                ]\n              },\n              value: {\n                type: 'string'\n              },\n              isVerified: {\n                type: 'boolean'\n              },\n              lastCheckedAt: {\n                type: 'string'\n              },\n              priority: {\n                type: 'number'\n              },\n              verificationStatus: {\n                type: 'string',\n                enum: [                  'verified',\n                  'missing',\n                  'pending'\n                ]\n              }\n            },\n            required: [              'name',\n              'type',\n              'value'\n            ]\n          }\n        }\n      },\n      required: [        'id',\n        'createdAt',\n        'domain',\n        'isManagedDefault',\n        'status',\n        'updatedAt',\n        'verifiedAt'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      domainId: {
        type: 'string',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['domainId'],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: AIInbx, args: Record<string, unknown> | undefined) => {
  const { domainId, jq_filter, ...body } = args as any;
  return asTextContentResult(await maybeFilter(jq_filter, await client.domains.retrieve(domainId)));
};

export default { metadata, tool, handler };
