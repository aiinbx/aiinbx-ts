import { McpOptions } from './options';

export type SdkMethod = {
  clientCallName: string;
  fullyQualifiedName: string;
  httpMethod?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'query';
  httpPath?: string;
};

export const sdkMethods: SdkMethod[] = [
  {
    clientCallName: 'client.threads.retrieve',
    fullyQualifiedName: 'threads.retrieve',
    httpMethod: 'get',
    httpPath: '/threads/{threadId}',
  },
  {
    clientCallName: 'client.threads.forward',
    fullyQualifiedName: 'threads.forward',
    httpMethod: 'post',
    httpPath: '/threads/{threadId}/forward',
  },
  {
    clientCallName: 'client.threads.search',
    fullyQualifiedName: 'threads.search',
    httpMethod: 'post',
    httpPath: '/threads/search',
  },
  {
    clientCallName: 'client.emails.retrieve',
    fullyQualifiedName: 'emails.retrieve',
    httpMethod: 'get',
    httpPath: '/emails/{emailId}',
  },
  {
    clientCallName: 'client.emails.reply',
    fullyQualifiedName: 'emails.reply',
    httpMethod: 'post',
    httpPath: '/emails/{emailId}/reply',
  },
  {
    clientCallName: 'client.emails.send',
    fullyQualifiedName: 'emails.send',
    httpMethod: 'post',
    httpPath: '/emails/send',
  },
  {
    clientCallName: 'client.domains.create',
    fullyQualifiedName: 'domains.create',
    httpMethod: 'post',
    httpPath: '/domains',
  },
  {
    clientCallName: 'client.domains.retrieve',
    fullyQualifiedName: 'domains.retrieve',
    httpMethod: 'get',
    httpPath: '/domains/{domainId}',
  },
  {
    clientCallName: 'client.domains.list',
    fullyQualifiedName: 'domains.list',
    httpMethod: 'get',
    httpPath: '/domains',
  },
  {
    clientCallName: 'client.domains.delete',
    fullyQualifiedName: 'domains.delete',
    httpMethod: 'delete',
    httpPath: '/domains/{domainId}',
  },
  {
    clientCallName: 'client.domains.verify',
    fullyQualifiedName: 'domains.verify',
    httpMethod: 'post',
    httpPath: '/domains/{domainId}/verify',
  },
  { clientCallName: 'client.webhooks.unwrap', fullyQualifiedName: 'webhooks.unwrap' },
  {
    clientCallName: 'client.meta.webhooksSchema',
    fullyQualifiedName: 'meta.webhooksSchema',
    httpMethod: 'get',
    httpPath: '/_meta/webhooks',
  },
];

function allowedMethodsForCodeTool(options: McpOptions | undefined): SdkMethod[] | undefined {
  if (!options) {
    return undefined;
  }

  let allowedMethods: SdkMethod[];

  if (options.codeAllowHttpGets || options.codeAllowedMethods) {
    // Start with nothing allowed and then add into it from options
    let allowedMethodsSet = new Set<SdkMethod>();

    if (options.codeAllowHttpGets) {
      // Add all methods that map to an HTTP GET
      sdkMethods
        .filter((method) => method.httpMethod === 'get')
        .forEach((method) => allowedMethodsSet.add(method));
    }

    if (options.codeAllowedMethods) {
      // Add all methods that match any of the allowed regexps
      const allowedRegexps = options.codeAllowedMethods.map((pattern) => {
        try {
          return new RegExp(pattern);
        } catch (e) {
          throw new Error(
            `Invalid regex pattern for allowed method: "${pattern}": ${e instanceof Error ? e.message : e}`,
          );
        }
      });

      sdkMethods
        .filter((method) => allowedRegexps.some((regexp) => regexp.test(method.fullyQualifiedName)))
        .forEach((method) => allowedMethodsSet.add(method));
    }

    allowedMethods = Array.from(allowedMethodsSet);
  } else {
    // Start with everything allowed
    allowedMethods = [...sdkMethods];
  }

  if (options.codeBlockedMethods) {
    // Filter down based on blocked regexps
    const blockedRegexps = options.codeBlockedMethods.map((pattern) => {
      try {
        return new RegExp(pattern);
      } catch (e) {
        throw new Error(
          `Invalid regex pattern for blocked method: "${pattern}": ${e instanceof Error ? e.message : e}`,
        );
      }
    });

    allowedMethods = allowedMethods.filter(
      (method) => !blockedRegexps.some((regexp) => regexp.test(method.fullyQualifiedName)),
    );
  }

  return allowedMethods;
}

export function blockedMethodsForCodeTool(options: McpOptions | undefined): SdkMethod[] | undefined {
  const allowedMethods = allowedMethodsForCodeTool(options);
  if (!allowedMethods) {
    return undefined;
  }

  const allowedSet = new Set(allowedMethods.map((method) => method.fullyQualifiedName));

  // Return any methods that are not explicitly allowed
  return sdkMethods.filter((method) => !allowedSet.has(method.fullyQualifiedName));
}
