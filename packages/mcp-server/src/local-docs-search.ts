// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import MiniSearch from 'minisearch';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { getLogger } from './logger';

type MethodEntry = {
  name: string;
  endpoint: string;
  httpMethod: string;
  summary: string;
  description: string;
  stainlessPath: string;
  qualified: string;
  params?: string[];
  response?: string;
  markdown?: string;
};

type ProseChunk = {
  content: string;
  tag: string;
  sectionContext?: string;
  source?: string;
};

type MiniSearchDocument = {
  id: string;
  kind: 'http_method' | 'prose';
  name?: string;
  endpoint?: string;
  summary?: string;
  description?: string;
  qualified?: string;
  stainlessPath?: string;
  content?: string;
  sectionContext?: string;
  _original: Record<string, unknown>;
};

type SearchResult = {
  results: (string | Record<string, unknown>)[];
};

const EMBEDDED_METHODS: MethodEntry[] = [
  {
    name: 'retrieve',
    endpoint: '/threads/{threadId}',
    httpMethod: 'get',
    summary: 'Get thread by ID',
    description: 'Retrieve a specific thread with all its emails by thread ID using API key authentication',
    stainlessPath: '(resource) threads > (method) retrieve',
    qualified: 'client.threads.retrieve',
    params: ['threadId: string;'],
    response:
      "{ id: string; createdAt: string; emails: { id: string; attachments: { id: string; cid: string; contentType: string; createdAt: string; disposition: string; expiresAt: string; fileName: string; signedUrl: string; sizeInBytes: number; }[]; bccAddresses: string[]; ccAddresses: string[]; createdAt: string; direction: 'INBOUND' | 'OUTBOUND'; fromAddress: string; fromName: string; html: string; inReplyToId: string; messageId: string; receivedAt: string; references: string[]; replyToAddresses: string[]; sentAt: string; snippet: string; status: string; strippedHtml: string; strippedText: string; subject: string; text: string; threadId: string; toAddresses: string[]; }[]; subject: string; }",
    markdown:
      "## retrieve\n\n`client.threads.retrieve(threadId: string): { id: string; createdAt: string; emails: object[]; subject: string; }`\n\n**get** `/threads/{threadId}`\n\nRetrieve a specific thread with all its emails by thread ID using API key authentication\n\n### Parameters\n\n- `threadId: string`\n\n### Returns\n\n- `{ id: string; createdAt: string; emails: { id: string; attachments: { id: string; cid: string; contentType: string; createdAt: string; disposition: string; expiresAt: string; fileName: string; signedUrl: string; sizeInBytes: number; }[]; bccAddresses: string[]; ccAddresses: string[]; createdAt: string; direction: 'INBOUND' | 'OUTBOUND'; fromAddress: string; fromName: string; html: string; inReplyToId: string; messageId: string; receivedAt: string; references: string[]; replyToAddresses: string[]; sentAt: string; snippet: string; status: string; strippedHtml: string; strippedText: string; subject: string; text: string; threadId: string; toAddresses: string[]; }[]; subject: string; }`\n\n  - `id: string`\n  - `createdAt: string`\n  - `emails: { id: string; attachments: { id: string; cid: string; contentType: string; createdAt: string; disposition: string; expiresAt: string; fileName: string; signedUrl: string; sizeInBytes: number; }[]; bccAddresses: string[]; ccAddresses: string[]; createdAt: string; direction: 'INBOUND' | 'OUTBOUND'; fromAddress: string; fromName: string; html: string; inReplyToId: string; messageId: string; receivedAt: string; references: string[]; replyToAddresses: string[]; sentAt: string; snippet: string; status: string; strippedHtml: string; strippedText: string; subject: string; text: string; threadId: string; toAddresses: string[]; }[]`\n  - `subject: string`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst thread = await client.threads.retrieve('threadId');\n\nconsole.log(thread);\n```",
  },
  {
    name: 'forward',
    endpoint: '/threads/{threadId}/forward',
    httpMethod: 'post',
    summary: 'Forward a thread to email',
    description: 'Forward the entire thread as a readable transcript.',
    stainlessPath: '(resource) threads > (method) forward',
    qualified: 'client.threads.forward',
    params: [
      'threadId: string;',
      'to: string | string[];',
      "attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[];",
      'bcc?: string | string[];',
      'cc?: string | string[];',
      'from?: string;',
      'from_name?: string;',
      'includeAttachments?: boolean;',
      'is_draft?: boolean;',
      'note?: string;',
      'track_clicks?: boolean;',
      'track_opens?: boolean;',
    ],
    response: '{ emailId: string; messageId: string; threadId: string; }',
    markdown:
      "## forward\n\n`client.threads.forward(threadId: string, to: string | string[], attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[], bcc?: string | string[], cc?: string | string[], from?: string, from_name?: string, includeAttachments?: boolean, is_draft?: boolean, note?: string, track_clicks?: boolean, track_opens?: boolean): { emailId: string; messageId: string; threadId: string; }`\n\n**post** `/threads/{threadId}/forward`\n\nForward the entire thread as a readable transcript.\n\n### Parameters\n\n- `threadId: string`\n\n- `to: string | string[]`\n\n- `attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[]`\n\n- `bcc?: string | string[]`\n\n- `cc?: string | string[]`\n\n- `from?: string`\n\n- `from_name?: string`\n\n- `includeAttachments?: boolean`\n\n- `is_draft?: boolean`\n\n- `note?: string`\n\n- `track_clicks?: boolean`\n\n- `track_opens?: boolean`\n\n### Returns\n\n- `{ emailId: string; messageId: string; threadId: string; }`\n\n  - `emailId: string`\n  - `messageId: string`\n  - `threadId: string`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst response = await client.threads.forward('threadId', { to: 'dev@stainless.com' });\n\nconsole.log(response);\n```",
  },
  {
    name: 'search',
    endpoint: '/threads/search',
    httpMethod: 'post',
    summary: 'Search threads with filters',
    description: 'Search threads with various filtering options optimized for AI agents',
    stainlessPath: '(resource) threads > (method) search',
    qualified: 'client.threads.search',
    params: [
      "conversationState?: 'awaiting_reply' | 'needs_reply' | 'active' | 'stale';",
      'createdAfter?: string;',
      'createdBefore?: string;',
      'hasEmailFromAddress?: string;',
      'hasEmailToAddress?: string;',
      'hasParticipantEmails?: string[];',
      'lastEmailAfter?: string;',
      'lastEmailBefore?: string;',
      'limit?: number;',
      'offset?: number;',
      "someEmailHasDirection?: 'INBOUND' | 'OUTBOUND';",
      'someEmailHasStatus?: string;',
      "sortBy?: 'createdAt' | 'lastEmailAt' | 'subject';",
      "sortOrder?: 'asc' | 'desc';",
      'staleThresholdDays?: number;',
      'subjectContains?: string;',
    ],
    response:
      '{ pagination: { hasMore: boolean; limit: number; offset: number; total: number; }; threads: { id: string; createdAt: string; emailCount: number; lastEmailAt: string; participantEmails: string[]; snippet: string; subject: string; updatedAt: string; }[]; }',
    markdown:
      "## search\n\n`client.threads.search(conversationState?: 'awaiting_reply' | 'needs_reply' | 'active' | 'stale', createdAfter?: string, createdBefore?: string, hasEmailFromAddress?: string, hasEmailToAddress?: string, hasParticipantEmails?: string[], lastEmailAfter?: string, lastEmailBefore?: string, limit?: number, offset?: number, someEmailHasDirection?: 'INBOUND' | 'OUTBOUND', someEmailHasStatus?: string, sortBy?: 'createdAt' | 'lastEmailAt' | 'subject', sortOrder?: 'asc' | 'desc', staleThresholdDays?: number, subjectContains?: string): { pagination: object; threads: object[]; }`\n\n**post** `/threads/search`\n\nSearch threads with various filtering options optimized for AI agents\n\n### Parameters\n\n- `conversationState?: 'awaiting_reply' | 'needs_reply' | 'active' | 'stale'`\n\n- `createdAfter?: string`\n\n- `createdBefore?: string`\n\n- `hasEmailFromAddress?: string`\n\n- `hasEmailToAddress?: string`\n\n- `hasParticipantEmails?: string[]`\n\n- `lastEmailAfter?: string`\n\n- `lastEmailBefore?: string`\n\n- `limit?: number`\n\n- `offset?: number`\n\n- `someEmailHasDirection?: 'INBOUND' | 'OUTBOUND'`\n\n- `someEmailHasStatus?: string`\n\n- `sortBy?: 'createdAt' | 'lastEmailAt' | 'subject'`\n\n- `sortOrder?: 'asc' | 'desc'`\n\n- `staleThresholdDays?: number`\n\n- `subjectContains?: string`\n\n### Returns\n\n- `{ pagination: { hasMore: boolean; limit: number; offset: number; total: number; }; threads: { id: string; createdAt: string; emailCount: number; lastEmailAt: string; participantEmails: string[]; snippet: string; subject: string; updatedAt: string; }[]; }`\n\n  - `pagination: { hasMore: boolean; limit: number; offset: number; total: number; }`\n  - `threads: { id: string; createdAt: string; emailCount: number; lastEmailAt: string; participantEmails: string[]; snippet: string; subject: string; updatedAt: string; }[]`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst response = await client.threads.search();\n\nconsole.log(response);\n```",
  },
  {
    name: 'retrieve',
    endpoint: '/emails/{emailId}',
    httpMethod: 'get',
    summary: 'Get email by ID',
    description: 'Retrieve a specific email by its ID using API key authentication',
    stainlessPath: '(resource) emails > (method) retrieve',
    qualified: 'client.emails.retrieve',
    params: ['emailId: string;'],
    response:
      "{ id: string; attachments: { id: string; cid: string; contentType: string; createdAt: string; disposition: string; expiresAt: string; fileName: string; signedUrl: string; sizeInBytes: number; }[]; bccAddresses: string[]; ccAddresses: string[]; createdAt: string; direction: 'INBOUND' | 'OUTBOUND'; fromAddress: string; fromName: string; html: string; inReplyToId: string; messageId: string; receivedAt: string; references: string[]; replyToAddresses: string[]; sentAt: string; snippet: string; status: string; strippedHtml: string; strippedText: string; subject: string; text: string; threadId: string; toAddresses: string[]; }",
    markdown:
      "## retrieve\n\n`client.emails.retrieve(emailId: string): { id: string; attachments: object[]; bccAddresses: string[]; ccAddresses: string[]; createdAt: string; direction: 'INBOUND' | 'OUTBOUND'; fromAddress: string; fromName: string; html: string; inReplyToId: string; messageId: string; receivedAt: string; references: string[]; replyToAddresses: string[]; sentAt: string; snippet: string; status: string; strippedHtml: string; strippedText: string; subject: string; text: string; threadId: string; toAddresses: string[]; }`\n\n**get** `/emails/{emailId}`\n\nRetrieve a specific email by its ID using API key authentication\n\n### Parameters\n\n- `emailId: string`\n\n### Returns\n\n- `{ id: string; attachments: { id: string; cid: string; contentType: string; createdAt: string; disposition: string; expiresAt: string; fileName: string; signedUrl: string; sizeInBytes: number; }[]; bccAddresses: string[]; ccAddresses: string[]; createdAt: string; direction: 'INBOUND' | 'OUTBOUND'; fromAddress: string; fromName: string; html: string; inReplyToId: string; messageId: string; receivedAt: string; references: string[]; replyToAddresses: string[]; sentAt: string; snippet: string; status: string; strippedHtml: string; strippedText: string; subject: string; text: string; threadId: string; toAddresses: string[]; }`\n\n  - `id: string`\n  - `attachments: { id: string; cid: string; contentType: string; createdAt: string; disposition: string; expiresAt: string; fileName: string; signedUrl: string; sizeInBytes: number; }[]`\n  - `bccAddresses: string[]`\n  - `ccAddresses: string[]`\n  - `createdAt: string`\n  - `direction: 'INBOUND' | 'OUTBOUND'`\n  - `fromAddress: string`\n  - `fromName: string`\n  - `html: string`\n  - `inReplyToId: string`\n  - `messageId: string`\n  - `receivedAt: string`\n  - `references: string[]`\n  - `replyToAddresses: string[]`\n  - `sentAt: string`\n  - `snippet: string`\n  - `status: string`\n  - `strippedHtml: string`\n  - `strippedText: string`\n  - `subject: string`\n  - `text: string`\n  - `threadId: string`\n  - `toAddresses: string[]`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst email = await client.emails.retrieve('emailId');\n\nconsole.log(email);\n```",
  },
  {
    name: 'reply',
    endpoint: '/emails/{emailId}/reply',
    httpMethod: 'post',
    summary: 'Reply to an email',
    description:
      'Reply to an existing email. Automatically handles reply headers (In-Reply-To, References) and thread association. The reply will be sent from a verified domain belonging to the organization.',
    stainlessPath: '(resource) emails > (method) reply',
    qualified: 'client.emails.reply',
    params: [
      'emailId: string;',
      'from: string;',
      'html: string;',
      "attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[];",
      'bcc?: string | string[];',
      'cc?: string | string[];',
      'from_name?: string;',
      'is_draft?: boolean;',
      'reply_all?: boolean;',
      'subject?: string;',
      'text?: string;',
      'to?: string | string[];',
      'track_clicks?: boolean;',
      'track_opens?: boolean;',
    ],
    response: '{ emailId: string; messageId: string; threadId: string; }',
    markdown:
      "## reply\n\n`client.emails.reply(emailId: string, from: string, html: string, attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[], bcc?: string | string[], cc?: string | string[], from_name?: string, is_draft?: boolean, reply_all?: boolean, subject?: string, text?: string, to?: string | string[], track_clicks?: boolean, track_opens?: boolean): { emailId: string; messageId: string; threadId: string; }`\n\n**post** `/emails/{emailId}/reply`\n\nReply to an existing email. Automatically handles reply headers (In-Reply-To, References) and thread association. The reply will be sent from a verified domain belonging to the organization.\n\n### Parameters\n\n- `emailId: string`\n\n- `from: string`\n\n- `html: string`\n\n- `attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[]`\n\n- `bcc?: string | string[]`\n\n- `cc?: string | string[]`\n\n- `from_name?: string`\n\n- `is_draft?: boolean`\n\n- `reply_all?: boolean`\n\n- `subject?: string`\n\n- `text?: string`\n\n- `to?: string | string[]`\n\n- `track_clicks?: boolean`\n\n- `track_opens?: boolean`\n\n### Returns\n\n- `{ emailId: string; messageId: string; threadId: string; }`\n\n  - `emailId: string`\n  - `messageId: string`\n  - `threadId: string`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst response = await client.emails.reply('emailId', { from: 'dev@stainless.com', html: 'html' });\n\nconsole.log(response);\n```",
  },
  {
    name: 'send',
    endpoint: '/emails/send',
    httpMethod: 'post',
    summary: 'Send an email',
    description:
      'Send an email from a verified domain belonging to the organization. Useful for transactional or conversational messages. Returns metadata including identifiers for further queries.',
    stainlessPath: '(resource) emails > (method) send',
    qualified: 'client.emails.send',
    params: [
      'from: string;',
      'html: string;',
      'subject: string;',
      'to: string | string[];',
      "attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[];",
      'bcc?: string | string[];',
      'cc?: string | string[];',
      'from_name?: string;',
      'in_reply_to?: string;',
      'is_draft?: boolean;',
      'references?: string[];',
      'reply_to?: string | string[];',
      'text?: string;',
      'threadId?: string;',
      'track_clicks?: boolean;',
      'track_opens?: boolean;',
    ],
    response: '{ emailId: string; messageId: string; threadId: string; }',
    markdown:
      "## send\n\n`client.emails.send(from: string, html: string, subject: string, to: string | string[], attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[], bcc?: string | string[], cc?: string | string[], from_name?: string, in_reply_to?: string, is_draft?: boolean, references?: string[], reply_to?: string | string[], text?: string, threadId?: string, track_clicks?: boolean, track_opens?: boolean): { emailId: string; messageId: string; threadId: string; }`\n\n**post** `/emails/send`\n\nSend an email from a verified domain belonging to the organization. Useful for transactional or conversational messages. Returns metadata including identifiers for further queries.\n\n### Parameters\n\n- `from: string`\n\n- `html: string`\n\n- `subject: string`\n\n- `to: string | string[]`\n\n- `attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[]`\n\n- `bcc?: string | string[]`\n\n- `cc?: string | string[]`\n\n- `from_name?: string`\n\n- `in_reply_to?: string`\n\n- `is_draft?: boolean`\n\n- `references?: string[]`\n\n- `reply_to?: string | string[]`\n\n- `text?: string`\n\n- `threadId?: string`\n\n- `track_clicks?: boolean`\n\n- `track_opens?: boolean`\n\n### Returns\n\n- `{ emailId: string; messageId: string; threadId: string; }`\n\n  - `emailId: string`\n  - `messageId: string`\n  - `threadId: string`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst response = await client.emails.send({\n  from: 'dev@stainless.com',\n  html: 'html',\n  subject: 'subject',\n  to: 'dev@stainless.com',\n});\n\nconsole.log(response);\n```",
  },
  {
    name: 'create',
    endpoint: '/domains',
    httpMethod: 'post',
    summary: 'Create domain',
    description: 'Create a new domain for the organization and return required DNS records to configure.',
    stainlessPath: '(resource) domains > (method) create',
    qualified: 'client.domains.create',
    params: ['domain: string;'],
    response:
      "{ domainId: string; records: { name: string; type: 'TXT' | 'CNAME' | 'MX'; value: string; priority?: number; }[]; }",
    markdown:
      "## create\n\n`client.domains.create(domain: string): { domainId: string; records: object[]; }`\n\n**post** `/domains`\n\nCreate a new domain for the organization and return required DNS records to configure.\n\n### Parameters\n\n- `domain: string`\n\n### Returns\n\n- `{ domainId: string; records: { name: string; type: 'TXT' | 'CNAME' | 'MX'; value: string; priority?: number; }[]; }`\n\n  - `domainId: string`\n  - `records: { name: string; type: 'TXT' | 'CNAME' | 'MX'; value: string; priority?: number; }[]`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst domain = await client.domains.create({ domain: 'sfN2.l.iJR-BU.u9JV9.a.m.o2D-4b-Jd.0Z-kX.L.n.S.f.ukBXb' });\n\nconsole.log(domain);\n```",
  },
  {
    name: 'retrieve',
    endpoint: '/domains/{domainId}',
    httpMethod: 'get',
    summary: 'Get domain by ID',
    description: 'Retrieve a domain by its ID',
    stainlessPath: '(resource) domains > (method) retrieve',
    qualified: 'client.domains.retrieve',
    params: ['domainId: string;'],
    response:
      "{ id: string; createdAt: string; domain: string; isManagedDefault: boolean; status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED'; updatedAt: string; verifiedAt: string; dnsRecords?: { name: string; type: 'TXT' | 'CNAME' | 'MX'; value: string; isVerified?: boolean; lastCheckedAt?: string; priority?: number; verificationStatus?: 'verified' | 'missing' | 'pending'; }[]; }",
    markdown:
      "## retrieve\n\n`client.domains.retrieve(domainId: string): { id: string; createdAt: string; domain: string; isManagedDefault: boolean; status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED'; updatedAt: string; verifiedAt: string; dnsRecords?: object[]; }`\n\n**get** `/domains/{domainId}`\n\nRetrieve a domain by its ID\n\n### Parameters\n\n- `domainId: string`\n\n### Returns\n\n- `{ id: string; createdAt: string; domain: string; isManagedDefault: boolean; status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED'; updatedAt: string; verifiedAt: string; dnsRecords?: { name: string; type: 'TXT' | 'CNAME' | 'MX'; value: string; isVerified?: boolean; lastCheckedAt?: string; priority?: number; verificationStatus?: 'verified' | 'missing' | 'pending'; }[]; }`\n\n  - `id: string`\n  - `createdAt: string`\n  - `domain: string`\n  - `isManagedDefault: boolean`\n  - `status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED'`\n  - `updatedAt: string`\n  - `verifiedAt: string`\n  - `dnsRecords?: { name: string; type: 'TXT' | 'CNAME' | 'MX'; value: string; isVerified?: boolean; lastCheckedAt?: string; priority?: number; verificationStatus?: 'verified' | 'missing' | 'pending'; }[]`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst domain = await client.domains.retrieve('domainId');\n\nconsole.log(domain);\n```",
  },
  {
    name: 'list',
    endpoint: '/domains',
    httpMethod: 'get',
    summary: 'List domains',
    description: "List all domains belonging to the API key's organization",
    stainlessPath: '(resource) domains > (method) list',
    qualified: 'client.domains.list',
    response:
      "{ domains: { id: string; createdAt: string; domain: string; isManagedDefault: boolean; status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED'; updatedAt: string; verifiedAt: string; dnsRecords?: { name: string; type: 'TXT' | 'CNAME' | 'MX'; value: string; isVerified?: boolean; lastCheckedAt?: string; priority?: number; verificationStatus?: 'verified' | 'missing' | 'pending'; }[]; }[]; }",
    markdown:
      "## list\n\n`client.domains.list(): { domains: object[]; }`\n\n**get** `/domains`\n\nList all domains belonging to the API key's organization\n\n### Returns\n\n- `{ domains: { id: string; createdAt: string; domain: string; isManagedDefault: boolean; status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED'; updatedAt: string; verifiedAt: string; dnsRecords?: { name: string; type: 'TXT' | 'CNAME' | 'MX'; value: string; isVerified?: boolean; lastCheckedAt?: string; priority?: number; verificationStatus?: 'verified' | 'missing' | 'pending'; }[]; }[]; }`\n\n  - `domains: { id: string; createdAt: string; domain: string; isManagedDefault: boolean; status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED'; updatedAt: string; verifiedAt: string; dnsRecords?: { name: string; type: 'TXT' | 'CNAME' | 'MX'; value: string; isVerified?: boolean; lastCheckedAt?: string; priority?: number; verificationStatus?: 'verified' | 'missing' | 'pending'; }[]; }[]`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst domains = await client.domains.list();\n\nconsole.log(domains);\n```",
  },
  {
    name: 'delete',
    endpoint: '/domains/{domainId}',
    httpMethod: 'delete',
    summary: 'Delete domain',
    description: 'Delete a domain by ID from the organization',
    stainlessPath: '(resource) domains > (method) delete',
    qualified: 'client.domains.delete',
    params: ['domainId: string;'],
    response: '{ success: true; }',
    markdown:
      "## delete\n\n`client.domains.delete(domainId: string): { success: true; }`\n\n**delete** `/domains/{domainId}`\n\nDelete a domain by ID from the organization\n\n### Parameters\n\n- `domainId: string`\n\n### Returns\n\n- `{ success: true; }`\n\n  - `success: true`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst domain = await client.domains.delete('domainId');\n\nconsole.log(domain);\n```",
  },
  {
    name: 'verify',
    endpoint: '/domains/{domainId}/verify',
    httpMethod: 'post',
    summary: 'Verify domain DNS & SES status',
    description:
      'Run verification checks for the domain and update its stored status and DNS record verification flags.',
    stainlessPath: '(resource) domains > (method) verify',
    qualified: 'client.domains.verify',
    params: ['domainId: string;'],
    response:
      "{ domain: { id: string; createdAt: string; domain: string; isManagedDefault: boolean; status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED'; updatedAt: string; verifiedAt: string; dnsRecords?: { name: string; type: 'TXT' | 'CNAME' | 'MX'; value: string; isVerified?: boolean; lastCheckedAt?: string; priority?: number; verificationStatus?: 'verified' | 'missing' | 'pending'; }[]; }; verification: { debug: { actualVerificationTokens: string[]; domain: string; verificationTokenMatch: boolean; expectedVerificationToken?: string; }; dkimStatus: 'Pending' | 'Success' | 'Failed' | 'NotStarted' | 'TemporaryFailure'; dns: { dkim: object; dmarc: object; domainVerification: boolean; mailFrom: object; mx: object; spf: boolean; }; mxConflict: { hasConflict: boolean; conflictingRecords?: object[]; message?: string; }; ready: boolean; verification: 'Pending' | 'Success' | 'Failed' | 'NotStarted' | 'TemporaryFailure'; }; }",
    markdown:
      "## verify\n\n`client.domains.verify(domainId: string): { domain: object; verification: object; }`\n\n**post** `/domains/{domainId}/verify`\n\nRun verification checks for the domain and update its stored status and DNS record verification flags.\n\n### Parameters\n\n- `domainId: string`\n\n### Returns\n\n- `{ domain: { id: string; createdAt: string; domain: string; isManagedDefault: boolean; status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED'; updatedAt: string; verifiedAt: string; dnsRecords?: { name: string; type: 'TXT' | 'CNAME' | 'MX'; value: string; isVerified?: boolean; lastCheckedAt?: string; priority?: number; verificationStatus?: 'verified' | 'missing' | 'pending'; }[]; }; verification: { debug: { actualVerificationTokens: string[]; domain: string; verificationTokenMatch: boolean; expectedVerificationToken?: string; }; dkimStatus: 'Pending' | 'Success' | 'Failed' | 'NotStarted' | 'TemporaryFailure'; dns: { dkim: object; dmarc: object; domainVerification: boolean; mailFrom: object; mx: object; spf: boolean; }; mxConflict: { hasConflict: boolean; conflictingRecords?: object[]; message?: string; }; ready: boolean; verification: 'Pending' | 'Success' | 'Failed' | 'NotStarted' | 'TemporaryFailure'; }; }`\n\n  - `domain: { id: string; createdAt: string; domain: string; isManagedDefault: boolean; status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED'; updatedAt: string; verifiedAt: string; dnsRecords?: { name: string; type: 'TXT' | 'CNAME' | 'MX'; value: string; isVerified?: boolean; lastCheckedAt?: string; priority?: number; verificationStatus?: 'verified' | 'missing' | 'pending'; }[]; }`\n  - `verification: { debug: { actualVerificationTokens: string[]; domain: string; verificationTokenMatch: boolean; expectedVerificationToken?: string; }; dkimStatus: 'Pending' | 'Success' | 'Failed' | 'NotStarted' | 'TemporaryFailure'; dns: { dkim: object; dmarc: { present: boolean; source: 'subdomain' | 'parent' | 'none'; }; domainVerification: boolean; mailFrom: { domain: string; mx: boolean; spf: boolean; }; mx: { expectedPriority: number; found: boolean; records: { exchange: string; priority: number; }[]; }; spf: boolean; }; mxConflict: { hasConflict: boolean; conflictingRecords?: { exchange: string; priority: number; }[]; message?: string; }; ready: boolean; verification: 'Pending' | 'Success' | 'Failed' | 'NotStarted' | 'TemporaryFailure'; }`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst response = await client.domains.verify('domainId');\n\nconsole.log(response);\n```",
  },
  {
    name: 'webhooks_schema',
    endpoint: '/_meta/webhooks',
    httpMethod: 'get',
    summary: 'Webhook event schema (union)',
    description: 'Internal endpoint to expose webhook event schemas to SDK generators.',
    stainlessPath: '(resource) meta > (method) webhooks_schema',
    qualified: 'client.meta.webhooksSchema',
    response:
      "{ attempt: number; data: object; event: 'inbound.email.received'; timestamp: number; } | { attempt: number; data: object; event: 'outbound.email.delivered'; timestamp: number; } | { attempt: number; data: object; event: 'outbound.email.bounced'; timestamp: number; } | { attempt: number; data: object; event: 'outbound.email.complained'; timestamp: number; } | { attempt: number; data: object; event: 'outbound.email.rejected'; timestamp: number; } | { attempt: number; data: object; event: 'outbound.email.opened'; timestamp: number; } | { attempt: number; data: object; event: 'outbound.email.clicked'; timestamp: number; }",
    markdown:
      "## webhooks_schema\n\n`client.meta.webhooksSchema(): { attempt: number; data: object; event: 'inbound.email.received'; timestamp: number; } | { attempt: number; data: object; event: 'outbound.email.delivered'; timestamp: number; } | { attempt: number; data: object; event: 'outbound.email.bounced'; timestamp: number; } | { attempt: number; data: object; event: 'outbound.email.complained'; timestamp: number; } | { attempt: number; data: object; event: 'outbound.email.rejected'; timestamp: number; } | { attempt: number; data: object; event: 'outbound.email.opened'; timestamp: number; } | { attempt: number; data: object; event: 'outbound.email.clicked'; timestamp: number; }`\n\n**get** `/_meta/webhooks`\n\nInternal endpoint to expose webhook event schemas to SDK generators.\n\n### Returns\n\n- `{ attempt: number; data: { email: { id: string; attachments: object[]; bccAddresses: string[]; ccAddresses: string[]; createdAt: string; direction: 'INBOUND' | 'OUTBOUND'; fromAddress: string; messageId: string; references: string[]; replyToAddresses: string[]; status: string; threadId: string; toAddresses: string[]; fromName?: string; html?: string; inReplyToId?: string; receivedAt?: string; sentAt?: string; snippet?: string; strippedHtml?: string; strippedText?: string; subject?: string; text?: string; }; organization: { id: string; slug: string; }; }; event: 'inbound.email.received'; timestamp: number; } | { attempt: number; data: { deliveredAt: string; messageId: string; recipients: string[]; emailId?: string; processingTimeMs?: number; remoteMtaIp?: string; smtpResponse?: string; }; event: 'outbound.email.delivered'; timestamp: number; } | { attempt: number; data: { bouncedAt: string; bounceType: 'Permanent' | 'Transient' | 'Undetermined'; messageId: string; recipients: { emailAddress: string; action?: string; diagnosticCode?: string; status?: string; }[]; bounceSubType?: string; emailId?: string; }; event: 'outbound.email.bounced'; timestamp: number; } | { attempt: number; data: { complainedAt: string; messageId: string; recipients: string[]; complaintFeedbackType?: string; emailId?: string; feedbackId?: string; userAgent?: string; }; event: 'outbound.email.complained'; timestamp: number; } | { attempt: number; data: { messageId: string; rejectedAt: string; emailId?: string; reason?: string; }; event: 'outbound.email.rejected'; timestamp: number; } | { attempt: number; data: { messageId: string; openedAt: string; emailId?: string; ipAddress?: string; userAgent?: string; }; event: 'outbound.email.opened'; timestamp: number; } | { attempt: number; data: { clickedAt: string; link: string; messageId: string; emailId?: string; ipAddress?: string; linkDomain?: string; userAgent?: string; }; event: 'outbound.email.clicked'; timestamp: number; }`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst response = await client.meta.webhooksSchema();\n\nconsole.log(response);\n```",
  },
];

const INDEX_OPTIONS = {
  fields: [
    'name',
    'endpoint',
    'summary',
    'description',
    'qualified',
    'stainlessPath',
    'content',
    'sectionContext',
  ],
  storeFields: ['kind', '_original'],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
    boost: {
      name: 3,
      endpoint: 2,
      summary: 2,
      qualified: 2,
      content: 1,
    } as Record<string, number>,
  },
};

/**
 * Self-contained local search engine backed by MiniSearch.
 * Method data is embedded at SDK build time; prose documents
 * can be loaded from an optional docs directory at runtime.
 */
export class LocalDocsSearch {
  private methodIndex: MiniSearch<MiniSearchDocument>;
  private proseIndex: MiniSearch<MiniSearchDocument>;

  private constructor() {
    this.methodIndex = new MiniSearch<MiniSearchDocument>(INDEX_OPTIONS);
    this.proseIndex = new MiniSearch<MiniSearchDocument>(INDEX_OPTIONS);
  }

  static async create(opts?: { docsDir?: string }): Promise<LocalDocsSearch> {
    const instance = new LocalDocsSearch();
    instance.indexMethods(EMBEDDED_METHODS);
    if (opts?.docsDir) {
      await instance.loadDocsDirectory(opts.docsDir);
    }
    return instance;
  }

  // Note: Language is accepted for interface consistency with remote search, but currently has no
  // effect since this local search only supports TypeScript docs.
  search(props: {
    query: string;
    language?: string;
    detail?: string;
    maxResults?: number;
    maxLength?: number;
  }): SearchResult {
    const { query, detail = 'default', maxResults = 5, maxLength = 100_000 } = props;

    const useMarkdown = detail === 'verbose' || detail === 'high';

    // Search both indices and merge results by score
    const methodHits = this.methodIndex
      .search(query)
      .map((hit) => ({ ...hit, _kind: 'http_method' as const }));
    const proseHits = this.proseIndex.search(query).map((hit) => ({ ...hit, _kind: 'prose' as const }));
    const merged = [...methodHits, ...proseHits].sort((a, b) => b.score - a.score);
    const top = merged.slice(0, maxResults);

    const fullResults: (string | Record<string, unknown>)[] = [];

    for (const hit of top) {
      const original = (hit as Record<string, unknown>)['_original'];
      if (hit._kind === 'http_method') {
        const m = original as MethodEntry;
        if (useMarkdown && m.markdown) {
          fullResults.push(m.markdown);
        } else {
          fullResults.push({
            method: m.qualified,
            summary: m.summary,
            description: m.description,
            endpoint: `${m.httpMethod.toUpperCase()} ${m.endpoint}`,
            ...(m.params ? { params: m.params } : {}),
            ...(m.response ? { response: m.response } : {}),
          });
        }
      } else {
        const c = original as ProseChunk;
        fullResults.push({
          content: c.content,
          ...(c.source ? { source: c.source } : {}),
        });
      }
    }

    let totalLength = 0;
    const results: (string | Record<string, unknown>)[] = [];
    for (const result of fullResults) {
      const len = typeof result === 'string' ? result.length : JSON.stringify(result).length;
      totalLength += len;
      if (totalLength > maxLength) break;
      results.push(result);
    }

    if (results.length < fullResults.length) {
      results.unshift(`Truncated; showing ${results.length} of ${fullResults.length} results.`);
    }

    return { results };
  }

  private indexMethods(methods: MethodEntry[]): void {
    const docs: MiniSearchDocument[] = methods.map((m, i) => ({
      id: `method-${i}`,
      kind: 'http_method' as const,
      name: m.name,
      endpoint: m.endpoint,
      summary: m.summary,
      description: m.description,
      qualified: m.qualified,
      stainlessPath: m.stainlessPath,
      _original: m as unknown as Record<string, unknown>,
    }));
    if (docs.length > 0) {
      this.methodIndex.addAll(docs);
    }
  }

  private async loadDocsDirectory(docsDir: string): Promise<void> {
    let entries;
    try {
      entries = await fs.readdir(docsDir, { withFileTypes: true });
    } catch (err) {
      getLogger().warn({ err, docsDir }, 'Could not read docs directory');
      return;
    }

    const files = entries
      .filter((e) => e.isFile())
      .filter((e) => e.name.endsWith('.md') || e.name.endsWith('.markdown') || e.name.endsWith('.json'));

    for (const file of files) {
      try {
        const filePath = path.join(docsDir, file.name);
        const content = await fs.readFile(filePath, 'utf-8');

        if (file.name.endsWith('.json')) {
          const texts = extractTexts(JSON.parse(content));
          if (texts.length > 0) {
            this.indexProse(texts.join('\n\n'), file.name);
          }
        } else {
          this.indexProse(content, file.name);
        }
      } catch (err) {
        getLogger().warn({ err, file: file.name }, 'Failed to index docs file');
      }
    }
  }

  private indexProse(markdown: string, source: string): void {
    const chunks = chunkMarkdown(markdown);
    const baseId = this.proseIndex.documentCount;

    const docs: MiniSearchDocument[] = chunks.map((chunk, i) => ({
      id: `prose-${baseId + i}`,
      kind: 'prose' as const,
      content: chunk.content,
      ...(chunk.sectionContext != null ? { sectionContext: chunk.sectionContext } : {}),
      _original: { ...chunk, source } as unknown as Record<string, unknown>,
    }));

    if (docs.length > 0) {
      this.proseIndex.addAll(docs);
    }
  }
}

/** Lightweight markdown chunker — splits on headers, chunks by word count. */
function chunkMarkdown(markdown: string): { content: string; tag: string; sectionContext?: string }[] {
  // Strip YAML frontmatter
  const stripped = markdown.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const lines = stripped.split('\n');

  const chunks: { content: string; tag: string; sectionContext?: string }[] = [];
  const headers: string[] = [];
  let current: string[] = [];

  const flush = () => {
    const text = current.join('\n').trim();
    if (!text) return;
    const sectionContext = headers.length > 0 ? headers.join(' > ') : undefined;
    // Split into ~200-word chunks
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length; i += 200) {
      const slice = words.slice(i, i + 200).join(' ');
      if (slice) {
        chunks.push({ content: slice, tag: 'p', ...(sectionContext != null ? { sectionContext } : {}) });
      }
    }
    current = [];
  };

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headerMatch) {
      flush();
      const level = headerMatch[1]!.length;
      const text = headerMatch[2]!.trim();
      while (headers.length >= level) headers.pop();
      headers.push(text);
    } else {
      current.push(line);
    }
  }
  flush();

  return chunks;
}

/** Recursively extracts string values from a JSON structure. */
function extractTexts(data: unknown, depth = 0): string[] {
  if (depth > 10) return [];
  if (typeof data === 'string') return data.trim() ? [data] : [];
  if (Array.isArray(data)) return data.flatMap((item) => extractTexts(item, depth + 1));
  if (typeof data === 'object' && data !== null) {
    return Object.values(data).flatMap((v) => extractTexts(v, depth + 1));
  }
  return [];
}
