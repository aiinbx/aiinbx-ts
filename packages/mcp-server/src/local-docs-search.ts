// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import MiniSearch from 'minisearch';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { getLogger } from './logger';

type PerLanguageData = {
  method?: string;
  example?: string;
};

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
  perLanguage?: Record<string, PerLanguageData>;
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
      "## search\n\n`client.threads.search(conversationState?: 'awaiting_reply' | 'needs_reply' | 'active' | 'stale', createdAfter?: string, createdBefore?: string, hasEmailFromAddress?: string, hasEmailToAddress?: string, hasParticipantEmails?: string[], lastEmailAfter?: string, lastEmailBefore?: string, limit?: number, offset?: number, someEmailHasDirection?: 'INBOUND' | 'OUTBOUND', someEmailHasStatus?: string, sortBy?: 'createdAt' | 'lastEmailAt' | 'subject', sortOrder?: 'asc' | 'desc', staleThresholdDays?: number, subjectContains?: string): { pagination: object; threads: object[]; }`\n\n**post** `/threads/search`\n\nSearch threads with various filtering options optimized for AI agents\n\n### Parameters\n\n- `conversationState?: 'awaiting_reply' | 'needs_reply' | 'active' | 'stale'`\n  Filter threads by conversation state\n\n- `createdAfter?: string`\n  Filter threads created after this date\n\n- `createdBefore?: string`\n  Filter threads created before this date\n\n- `hasEmailFromAddress?: string`\n  Filter threads with emails from this address\n\n- `hasEmailToAddress?: string`\n  Filter threads with emails to this address\n\n- `hasParticipantEmails?: string[]`\n  Filter threads that include all of these email addresses as participants\n\n- `lastEmailAfter?: string`\n  Filter threads with last email after this date\n\n- `lastEmailBefore?: string`\n  Filter threads with last email before this date\n\n- `limit?: number`\n  Number of threads to return (1-100)\n\n- `offset?: number`\n  Number of threads to skip\n\n- `someEmailHasDirection?: 'INBOUND' | 'OUTBOUND'`\n  Filter threads containing emails with this direction\n\n- `someEmailHasStatus?: string`\n  Filter threads containing emails with this status\n\n- `sortBy?: 'createdAt' | 'lastEmailAt' | 'subject'`\n  Field to sort by\n\n- `sortOrder?: 'asc' | 'desc'`\n  Sort order\n\n- `staleThresholdDays?: number`\n  Days to consider a thread stale (used with conversationState=stale)\n\n- `subjectContains?: string`\n  Filter threads where subject contains this text\n\n### Returns\n\n- `{ pagination: { hasMore: boolean; limit: number; offset: number; total: number; }; threads: { id: string; createdAt: string; emailCount: number; lastEmailAt: string; participantEmails: string[]; snippet: string; subject: string; updatedAt: string; }[]; }`\n\n  - `pagination: { hasMore: boolean; limit: number; offset: number; total: number; }`\n  - `threads: { id: string; createdAt: string; emailCount: number; lastEmailAt: string; participantEmails: string[]; snippet: string; subject: string; updatedAt: string; }[]`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst response = await client.threads.search();\n\nconsole.log(response);\n```",
    perLanguage: {
      typescript: {
        method: 'client.threads.search',
        example:
          "import AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.threads.search();\n\nconsole.log(response.pagination);",
      },
      python: {
        method: 'threads.search',
        example:
          'import os\nfrom aiinbx import AIInbx\n\nclient = AIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.threads.search()\nprint(response.pagination)',
      },
      http: {
        example:
          "curl https://aiinbx.com/api/v1/threads/search \\\n    -H 'Content-Type: application/json' \\\n    -H \"Authorization: Bearer $AI_INBX_API_KEY\" \\\n    -d '{}'",
      },
    },
  },
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
      "## retrieve\n\n`client.threads.retrieve(threadId: string): { id: string; createdAt: string; emails: object[]; subject: string; }`\n\n**get** `/threads/{threadId}`\n\nRetrieve a specific thread with all its emails by thread ID using API key authentication\n\n### Parameters\n\n- `threadId: string`\n  The unique identifier of the thread\n\n### Returns\n\n- `{ id: string; createdAt: string; emails: { id: string; attachments: { id: string; cid: string; contentType: string; createdAt: string; disposition: string; expiresAt: string; fileName: string; signedUrl: string; sizeInBytes: number; }[]; bccAddresses: string[]; ccAddresses: string[]; createdAt: string; direction: 'INBOUND' | 'OUTBOUND'; fromAddress: string; fromName: string; html: string; inReplyToId: string; messageId: string; receivedAt: string; references: string[]; replyToAddresses: string[]; sentAt: string; snippet: string; status: string; strippedHtml: string; strippedText: string; subject: string; text: string; threadId: string; toAddresses: string[]; }[]; subject: string; }`\n\n  - `id: string`\n  - `createdAt: string`\n  - `emails: { id: string; attachments: { id: string; cid: string; contentType: string; createdAt: string; disposition: string; expiresAt: string; fileName: string; signedUrl: string; sizeInBytes: number; }[]; bccAddresses: string[]; ccAddresses: string[]; createdAt: string; direction: 'INBOUND' | 'OUTBOUND'; fromAddress: string; fromName: string; html: string; inReplyToId: string; messageId: string; receivedAt: string; references: string[]; replyToAddresses: string[]; sentAt: string; snippet: string; status: string; strippedHtml: string; strippedText: string; subject: string; text: string; threadId: string; toAddresses: string[]; }[]`\n  - `subject: string`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst thread = await client.threads.retrieve('threadId');\n\nconsole.log(thread);\n```",
    perLanguage: {
      typescript: {
        method: 'client.threads.retrieve',
        example:
          "import AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nconst thread = await client.threads.retrieve('threadId');\n\nconsole.log(thread.id);",
      },
      python: {
        method: 'threads.retrieve',
        example:
          'import os\nfrom aiinbx import AIInbx\n\nclient = AIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\nthread = client.threads.retrieve(\n    "threadId",\n)\nprint(thread.id)',
      },
      http: {
        example:
          'curl https://aiinbx.com/api/v1/threads/$THREAD_ID \\\n    -H "Authorization: Bearer $AI_INBX_API_KEY"',
      },
    },
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
      "## forward\n\n`client.threads.forward(threadId: string, to: string | string[], attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[], bcc?: string | string[], cc?: string | string[], from?: string, from_name?: string, includeAttachments?: boolean, is_draft?: boolean, note?: string, track_clicks?: boolean, track_opens?: boolean): { emailId: string; messageId: string; threadId: string; }`\n\n**post** `/threads/{threadId}/forward`\n\nForward the entire thread as a readable transcript.\n\n### Parameters\n\n- `threadId: string`\n  The ID of the thread to forward\n\n- `to: string | string[]`\n  Recipient email address or list of addresses\n\n- `attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[]`\n  Optional additional attachments to include alongside any originals (if included).\n\n- `bcc?: string | string[]`\n  Optional BCC recipients\n\n- `cc?: string | string[]`\n  Optional CC recipients\n\n- `from?: string`\n  Optional sender address; auto-resolved if omitted\n\n- `from_name?: string`\n  Optional display name for the sender\n\n- `includeAttachments?: boolean`\n  Include original attachments as real file attachments (inline images embedded when referenced by CID)\n\n- `is_draft?: boolean`\n  If true, the forward is created as a draft\n\n- `note?: string`\n  Optional short context shown above the transcript\n\n- `track_clicks?: boolean`\n  Enable click tracking for this email. Overrides API key and org defaults.\n\n- `track_opens?: boolean`\n  Enable open tracking for this email. Overrides API key and org defaults.\n\n### Returns\n\n- `{ emailId: string; messageId: string; threadId: string; }`\n\n  - `emailId: string`\n  - `messageId: string`\n  - `threadId: string`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst response = await client.threads.forward('threadId', { to: 'dev@stainless.com' });\n\nconsole.log(response);\n```",
    perLanguage: {
      typescript: {
        method: 'client.threads.forward',
        example:
          "import AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.threads.forward('threadId', { to: 'dev@stainless.com' });\n\nconsole.log(response.emailId);",
      },
      python: {
        method: 'threads.forward',
        example:
          'import os\nfrom aiinbx import AIInbx\n\nclient = AIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.threads.forward(\n    thread_id="threadId",\n    to="dev@stainless.com",\n)\nprint(response.email_id)',
      },
      http: {
        example:
          'curl https://aiinbx.com/api/v1/threads/$THREAD_ID/forward \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $AI_INBX_API_KEY" \\\n    -d \'{\n          "to": "dev@stainless.com"\n        }\'',
      },
    },
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
      "## retrieve\n\n`client.emails.retrieve(emailId: string): { id: string; attachments: object[]; bccAddresses: string[]; ccAddresses: string[]; createdAt: string; direction: 'INBOUND' | 'OUTBOUND'; fromAddress: string; fromName: string; html: string; inReplyToId: string; messageId: string; receivedAt: string; references: string[]; replyToAddresses: string[]; sentAt: string; snippet: string; status: string; strippedHtml: string; strippedText: string; subject: string; text: string; threadId: string; toAddresses: string[]; }`\n\n**get** `/emails/{emailId}`\n\nRetrieve a specific email by its ID using API key authentication\n\n### Parameters\n\n- `emailId: string`\n  The unique identifier of the email\n\n### Returns\n\n- `{ id: string; attachments: { id: string; cid: string; contentType: string; createdAt: string; disposition: string; expiresAt: string; fileName: string; signedUrl: string; sizeInBytes: number; }[]; bccAddresses: string[]; ccAddresses: string[]; createdAt: string; direction: 'INBOUND' | 'OUTBOUND'; fromAddress: string; fromName: string; html: string; inReplyToId: string; messageId: string; receivedAt: string; references: string[]; replyToAddresses: string[]; sentAt: string; snippet: string; status: string; strippedHtml: string; strippedText: string; subject: string; text: string; threadId: string; toAddresses: string[]; }`\n\n  - `id: string`\n  - `attachments: { id: string; cid: string; contentType: string; createdAt: string; disposition: string; expiresAt: string; fileName: string; signedUrl: string; sizeInBytes: number; }[]`\n  - `bccAddresses: string[]`\n  - `ccAddresses: string[]`\n  - `createdAt: string`\n  - `direction: 'INBOUND' | 'OUTBOUND'`\n  - `fromAddress: string`\n  - `fromName: string`\n  - `html: string`\n  - `inReplyToId: string`\n  - `messageId: string`\n  - `receivedAt: string`\n  - `references: string[]`\n  - `replyToAddresses: string[]`\n  - `sentAt: string`\n  - `snippet: string`\n  - `status: string`\n  - `strippedHtml: string`\n  - `strippedText: string`\n  - `subject: string`\n  - `text: string`\n  - `threadId: string`\n  - `toAddresses: string[]`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst email = await client.emails.retrieve('emailId');\n\nconsole.log(email);\n```",
    perLanguage: {
      typescript: {
        method: 'client.emails.retrieve',
        example:
          "import AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nconst email = await client.emails.retrieve('emailId');\n\nconsole.log(email.id);",
      },
      python: {
        method: 'emails.retrieve',
        example:
          'import os\nfrom aiinbx import AIInbx\n\nclient = AIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\nemail = client.emails.retrieve(\n    "emailId",\n)\nprint(email.id)',
      },
      http: {
        example:
          'curl https://aiinbx.com/api/v1/emails/$EMAIL_ID \\\n    -H "Authorization: Bearer $AI_INBX_API_KEY"',
      },
    },
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
      "## send\n\n`client.emails.send(from: string, html: string, subject: string, to: string | string[], attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[], bcc?: string | string[], cc?: string | string[], from_name?: string, in_reply_to?: string, is_draft?: boolean, references?: string[], reply_to?: string | string[], text?: string, threadId?: string, track_clicks?: boolean, track_opens?: boolean): { emailId: string; messageId: string; threadId: string; }`\n\n**post** `/emails/send`\n\nSend an email from a verified domain belonging to the organization. Useful for transactional or conversational messages. Returns metadata including identifiers for further queries.\n\n### Parameters\n\n- `from: string`\n  Sender email address (must use a verified domain)\n\n- `html: string`\n  HTML body of the email\n\n- `subject: string`\n  Email subject\n\n- `to: string | string[]`\n  Recipient email address or list of addresses\n\n- `attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[]`\n  Optional list of attachments. Supports base64 or data URL; use cid for inline.\n\n- `bcc?: string | string[]`\n  Optional BCC recipients\n\n- `cc?: string | string[]`\n  Optional CC recipients\n\n- `from_name?: string`\n  Optional display name for the sender\n\n- `in_reply_to?: string`\n  Optional Message-ID of the email being replied to\n\n- `is_draft?: boolean`\n  If true, the email is a draft\n\n- `references?: string[]`\n  Optional list of Message-ID references\n\n- `reply_to?: string | string[]`\n  Optional Reply-To addresses\n\n- `text?: string`\n  Optional plain-text body of the email\n\n- `threadId?: string`\n  Optional existing thread ID to attach this email to\n\n- `track_clicks?: boolean`\n  Enable click tracking for this email. Overrides API key and org defaults.\n\n- `track_opens?: boolean`\n  Enable open tracking for this email. Overrides API key and org defaults.\n\n### Returns\n\n- `{ emailId: string; messageId: string; threadId: string; }`\n\n  - `emailId: string`\n  - `messageId: string`\n  - `threadId: string`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst response = await client.emails.send({\n  from: 'dev@stainless.com',\n  html: 'html',\n  subject: 'subject',\n  to: 'dev@stainless.com',\n});\n\nconsole.log(response);\n```",
    perLanguage: {
      typescript: {
        method: 'client.emails.send',
        example:
          "import AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.emails.send({\n  from: 'dev@stainless.com',\n  html: 'html',\n  subject: 'subject',\n  to: 'dev@stainless.com',\n});\n\nconsole.log(response.emailId);",
      },
      python: {
        method: 'emails.send',
        example:
          'import os\nfrom aiinbx import AIInbx\n\nclient = AIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.emails.send(\n    from_="dev@stainless.com",\n    html="html",\n    subject="subject",\n    to="dev@stainless.com",\n)\nprint(response.email_id)',
      },
      http: {
        example:
          'curl https://aiinbx.com/api/v1/emails/send \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $AI_INBX_API_KEY" \\\n    -d \'{\n          "from": "dev@stainless.com",\n          "html": "html",\n          "subject": "subject",\n          "to": "dev@stainless.com"\n        }\'',
      },
    },
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
      "## reply\n\n`client.emails.reply(emailId: string, from: string, html: string, attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[], bcc?: string | string[], cc?: string | string[], from_name?: string, is_draft?: boolean, reply_all?: boolean, subject?: string, text?: string, to?: string | string[], track_clicks?: boolean, track_opens?: boolean): { emailId: string; messageId: string; threadId: string; }`\n\n**post** `/emails/{emailId}/reply`\n\nReply to an existing email. Automatically handles reply headers (In-Reply-To, References) and thread association. The reply will be sent from a verified domain belonging to the organization.\n\n### Parameters\n\n- `emailId: string`\n  The ID of the email being replied to\n\n- `from: string`\n  Sender email address (must use a verified domain)\n\n- `html: string`\n  HTML body of the reply\n\n- `attachments?: { content: string; file_name: string; cid?: string; content_type?: string; disposition?: 'attachment' | 'inline'; }[]`\n  Optional list of attachments to include with this reply (e.g., inline images via cid).\n\n- `bcc?: string | string[]`\n  Optional BCC recipients\n\n- `cc?: string | string[]`\n  Optional CC recipients\n\n- `from_name?: string`\n  Optional display name for the sender\n\n- `is_draft?: boolean`\n  If true, the email is a draft\n\n- `reply_all?: boolean`\n  If true, includes all original recipients (to/cc) in the reply\n\n- `subject?: string`\n  Email subject. If not provided, uses \"Re: \" + original subject\n\n- `text?: string`\n  Optional plain-text body of the reply\n\n- `to?: string | string[]`\n  Override recipient addresses. If not provided, replies to the original sender and any reply-to addresses.\n\n- `track_clicks?: boolean`\n  Enable click tracking for this email. Overrides API key and org defaults.\n\n- `track_opens?: boolean`\n  Enable open tracking for this email. Overrides API key and org defaults.\n\n### Returns\n\n- `{ emailId: string; messageId: string; threadId: string; }`\n\n  - `emailId: string`\n  - `messageId: string`\n  - `threadId: string`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst response = await client.emails.reply('emailId', { from: 'dev@stainless.com', html: 'html' });\n\nconsole.log(response);\n```",
    perLanguage: {
      typescript: {
        method: 'client.emails.reply',
        example:
          "import AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.emails.reply('emailId', { from: 'dev@stainless.com', html: 'html' });\n\nconsole.log(response.emailId);",
      },
      python: {
        method: 'emails.reply',
        example:
          'import os\nfrom aiinbx import AIInbx\n\nclient = AIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.emails.reply(\n    email_id="emailId",\n    from_="dev@stainless.com",\n    html="html",\n)\nprint(response.email_id)',
      },
      http: {
        example:
          'curl https://aiinbx.com/api/v1/emails/$EMAIL_ID/reply \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $AI_INBX_API_KEY" \\\n    -d \'{\n          "from": "dev@stainless.com",\n          "html": "html"\n        }\'',
      },
    },
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
    perLanguage: {
      typescript: {
        method: 'client.domains.list',
        example:
          "import AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nconst domains = await client.domains.list();\n\nconsole.log(domains.domains);",
      },
      python: {
        method: 'domains.list',
        example:
          'import os\nfrom aiinbx import AIInbx\n\nclient = AIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\ndomains = client.domains.list()\nprint(domains.domains)',
      },
      http: {
        example: 'curl https://aiinbx.com/api/v1/domains \\\n    -H "Authorization: Bearer $AI_INBX_API_KEY"',
      },
    },
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
    perLanguage: {
      typescript: {
        method: 'client.domains.create',
        example:
          "import AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nconst domain = await client.domains.create({\n  domain: 'sfN2.l.iJR-BU.u9JV9.a.m.o2D-4b-Jd.0Z-kX.L.n.S.f.ukBXb',\n});\n\nconsole.log(domain.domainId);",
      },
      python: {
        method: 'domains.create',
        example:
          'import os\nfrom aiinbx import AIInbx\n\nclient = AIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\ndomain = client.domains.create(\n    domain="sfN2.l.iJR-BU.u9JV9.a.m.o2D-4b-Jd.0Z-kX.L.n.S.f.ukBXb",\n)\nprint(domain.domain_id)',
      },
      http: {
        example:
          'curl https://aiinbx.com/api/v1/domains \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $AI_INBX_API_KEY" \\\n    -d \'{\n          "domain": "sfN2.l.iJR-BU.u9JV9.a.m.o2D-4b-Jd.0Z-kX.L.n.S.f.ukBXb"\n        }\'',
      },
    },
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
      "## retrieve\n\n`client.domains.retrieve(domainId: string): { id: string; createdAt: string; domain: string; isManagedDefault: boolean; status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED'; updatedAt: string; verifiedAt: string; dnsRecords?: object[]; }`\n\n**get** `/domains/{domainId}`\n\nRetrieve a domain by its ID\n\n### Parameters\n\n- `domainId: string`\n  The unique identifier of the domain\n\n### Returns\n\n- `{ id: string; createdAt: string; domain: string; isManagedDefault: boolean; status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED'; updatedAt: string; verifiedAt: string; dnsRecords?: { name: string; type: 'TXT' | 'CNAME' | 'MX'; value: string; isVerified?: boolean; lastCheckedAt?: string; priority?: number; verificationStatus?: 'verified' | 'missing' | 'pending'; }[]; }`\n\n  - `id: string`\n  - `createdAt: string`\n  - `domain: string`\n  - `isManagedDefault: boolean`\n  - `status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED'`\n  - `updatedAt: string`\n  - `verifiedAt: string`\n  - `dnsRecords?: { name: string; type: 'TXT' | 'CNAME' | 'MX'; value: string; isVerified?: boolean; lastCheckedAt?: string; priority?: number; verificationStatus?: 'verified' | 'missing' | 'pending'; }[]`\n\n### Example\n\n```typescript\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx();\n\nconst domain = await client.domains.retrieve('domainId');\n\nconsole.log(domain);\n```",
    perLanguage: {
      typescript: {
        method: 'client.domains.retrieve',
        example:
          "import AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nconst domain = await client.domains.retrieve('domainId');\n\nconsole.log(domain.id);",
      },
      python: {
        method: 'domains.retrieve',
        example:
          'import os\nfrom aiinbx import AIInbx\n\nclient = AIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\ndomain = client.domains.retrieve(\n    "domainId",\n)\nprint(domain.id)',
      },
      http: {
        example:
          'curl https://aiinbx.com/api/v1/domains/$DOMAIN_ID \\\n    -H "Authorization: Bearer $AI_INBX_API_KEY"',
      },
    },
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
    perLanguage: {
      typescript: {
        method: 'client.domains.delete',
        example:
          "import AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nconst domain = await client.domains.delete('domainId');\n\nconsole.log(domain.success);",
      },
      python: {
        method: 'domains.delete',
        example:
          'import os\nfrom aiinbx import AIInbx\n\nclient = AIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\ndomain = client.domains.delete(\n    "domainId",\n)\nprint(domain.success)',
      },
      http: {
        example:
          'curl https://aiinbx.com/api/v1/domains/$DOMAIN_ID \\\n    -X DELETE \\\n    -H "Authorization: Bearer $AI_INBX_API_KEY"',
      },
    },
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
    perLanguage: {
      typescript: {
        method: 'client.domains.verify',
        example:
          "import AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.domains.verify('domainId');\n\nconsole.log(response.domain);",
      },
      python: {
        method: 'domains.verify',
        example:
          'import os\nfrom aiinbx import AIInbx\n\nclient = AIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.domains.verify(\n    "domainId",\n)\nprint(response.domain)',
      },
      http: {
        example:
          'curl https://aiinbx.com/api/v1/domains/$DOMAIN_ID/verify \\\n    -X POST \\\n    -H "Authorization: Bearer $AI_INBX_API_KEY"',
      },
    },
  },
  {
    name: 'unwrap',
    endpoint: '',
    httpMethod: '',
    summary: '',
    description: '',
    stainlessPath: '(resource) webhooks > (method) unwrap',
    qualified: 'client.webhooks.unwrap',
    perLanguage: {
      typescript: {
        method: 'client.webhooks.unwrap',
        example:
          "import AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nawait client.webhooks.unwrap();",
      },
      python: {
        method: 'webhooks.unwrap',
        example:
          'import os\nfrom aiinbx import AIInbx\n\nclient = AIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\nclient.webhooks.unwrap()',
      },
    },
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
    perLanguage: {
      typescript: {
        method: 'client.meta.webhooksSchema',
        example:
          "import AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.meta.webhooksSchema();\n\nconsole.log(response);",
      },
      python: {
        method: 'meta.webhooks_schema',
        example:
          'import os\nfrom aiinbx import AIInbx\n\nclient = AIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.meta.webhooks_schema()\nprint(response)',
      },
      http: {
        example:
          'curl https://aiinbx.com/api/v1/_meta/webhooks \\\n    -H "Authorization: Bearer $AI_INBX_API_KEY"',
      },
    },
  },
];

const EMBEDDED_READMES: { language: string; content: string }[] = [
  {
    language: 'python',
    content:
      '# AI Inbx Python API library\n\n<!-- prettier-ignore -->\n[![PyPI version](https://img.shields.io/pypi/v/aiinbx.svg?label=pypi%20(stable))](https://pypi.org/project/aiinbx/)\n\nThe AI Inbx Python library provides convenient access to the AI Inbx REST API from any Python 3.9+\napplication. The library includes type definitions for all request params and response fields,\nand offers both synchronous and asynchronous clients powered by [httpx](https://github.com/encode/httpx).\n\n\n\nIt is generated with [Stainless](https://www.stainless.com/).\n\n## MCP Server\n\nUse the AI Inbx MCP Server to enable AI assistants to interact with this API, allowing them to explore endpoints, make test requests, and use documentation to help integrate this SDK into your application.\n\n[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=aiinbx-mcp&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImFpaW5ieC1tY3AiXSwiZW52Ijp7IkFJX0lOQlhfQVBJX0tFWSI6Ik15IEFQSSBLZXkifX0)\n[![Install in VS Code](https://img.shields.io/badge/_-Add_to_VS_Code-blue?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iI0VFRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMzAuMjM1IDM5Ljg4NGEyLjQ5MSAyLjQ5MSAwIDAgMS0xLjc4MS0uNzNMMTIuNyAyNC43OGwtMy40NiAyLjYyNC0zLjQwNiAyLjU4MmExLjY2NSAxLjY2NSAwIDAgMS0xLjA4Mi4zMzggMS42NjQgMS42NjQgMCAwIDEtMS4wNDYtLjQzMWwtMi4yLTJhMS42NjYgMS42NjYgMCAwIDEgMC0yLjQ2M0w3LjQ1OCAyMCA0LjY3IDE3LjQ1MyAxLjUwNyAxNC41N2ExLjY2NSAxLjY2NSAwIDAgMSAwLTIuNDYzbDIuMi0yYTEuNjY1IDEuNjY1IDAgMCAxIDIuMTMtLjA5N2w2Ljg2MyA1LjIwOUwyOC40NTIuODQ0YTIuNDg4IDIuNDg4IDAgMCAxIDEuODQxLS43MjljLjM1MS4wMDkuNjk5LjA5MSAxLjAxOS4yNDVsOC4yMzYgMy45NjFhMi41IDIuNSAwIDAgMSAxLjQxNSAyLjI1M3YuMDk5LS4wNDVWMzMuMzd2LS4wNDUuMDk1YTIuNTAxIDIuNTAxIDAgMCAxLTEuNDE2IDIuMjU3bC04LjIzNSAzLjk2MWEyLjQ5MiAyLjQ5MiAwIDAgMS0xLjA3Ny4yNDZabS43MTYtMjguOTQ3LTExLjk0OCA5LjA2MiAxMS45NTIgOS4wNjUtLjAwNC0xOC4xMjdaIi8+PC9zdmc+)](https://vscode.stainless.com/mcp/%7B%22name%22%3A%22aiinbx-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22aiinbx-mcp%22%5D%2C%22env%22%3A%7B%22AI_INBX_API_KEY%22%3A%22My%20API%20Key%22%7D%7D)\n\n> Note: You may need to set environment variables in your MCP client.\n\n## Documentation\n\n The full API of this library can be found in [api.md](api.md).\n\n## Installation\n\n```sh\n# install from PyPI\npip install aiinbx\n```\n\n## Usage\n\nThe full API of this library can be found in [api.md](api.md).\n\n```python\nimport os\nfrom aiinbx import AIInbx\n\nclient = AIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\n\nresponse = client.threads.search()\nprint(response.pagination)\n```\n\nWhile you can provide an `api_key` keyword argument,\nwe recommend using [python-dotenv](https://pypi.org/project/python-dotenv/)\nto add `AI_INBX_API_KEY="My API Key"` to your `.env` file\nso that your API Key is not stored in source control.\n\n## Async usage\n\nSimply import `AsyncAIInbx` instead of `AIInbx` and use `await` with each API call:\n\n```python\nimport os\nimport asyncio\nfrom aiinbx import AsyncAIInbx\n\nclient = AsyncAIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n)\n\nasync def main() -> None:\n  response = await client.threads.search()\n  print(response.pagination)\n\nasyncio.run(main())\n```\n\nFunctionality between the synchronous and asynchronous clients is otherwise identical.\n\n### With aiohttp\n\nBy default, the async client uses `httpx` for HTTP requests. However, for improved concurrency performance you may also use `aiohttp` as the HTTP backend.\n\nYou can enable this by installing `aiohttp`:\n\n```sh\n# install from PyPI\npip install aiinbx[aiohttp]\n```\n\nThen you can enable it by instantiating the client with `http_client=DefaultAioHttpClient()`:\n\n```python\nimport os\nimport asyncio\nfrom aiinbx import DefaultAioHttpClient\nfrom aiinbx import AsyncAIInbx\n\nasync def main() -> None:\n  async with AsyncAIInbx(\n    api_key=os.environ.get("AI_INBX_API_KEY"),  # This is the default and can be omitted\n    http_client=DefaultAioHttpClient(),\n) as client:\n    response = await client.threads.search()\n    print(response.pagination)\n\nasyncio.run(main())\n```\n\n\n\n## Using types\n\nNested request parameters are [TypedDicts](https://docs.python.org/3/library/typing.html#typing.TypedDict). Responses are [Pydantic models](https://docs.pydantic.dev) which also provide helper methods for things like:\n\n- Serializing back into JSON, `model.to_json()`\n- Converting to a dictionary, `model.to_dict()`\n\nTyped requests and responses provide autocomplete and documentation within your editor. If you would like to see type errors in VS Code to help catch bugs earlier, set `python.analysis.typeCheckingMode` to `basic`.\n\n\n\n\n\n\n\n## Handling errors\n\nWhen the library is unable to connect to the API (for example, due to network connection problems or a timeout), a subclass of `aiinbx.APIConnectionError` is raised.\n\nWhen the API returns a non-success status code (that is, 4xx or 5xx\nresponse), a subclass of `aiinbx.APIStatusError` is raised, containing `status_code` and `response` properties.\n\nAll errors inherit from `aiinbx.APIError`.\n\n```python\nimport aiinbx\nfrom aiinbx import AIInbx\n\nclient = AIInbx()\n\ntry:\n    client.threads.search()\nexcept aiinbx.APIConnectionError as e:\n    print("The server could not be reached")\n    print(e.__cause__) # an underlying Exception, likely raised within httpx.\nexcept aiinbx.RateLimitError as e:\n    print("A 429 status code was received; we should back off a bit.")\nexcept aiinbx.APIStatusError as e:\n    print("Another non-200-range status code was received")\n    print(e.status_code)\n    print(e.response)\n```\n\nError codes are as follows:\n\n| Status Code | Error Type                 |\n| ----------- | -------------------------- |\n| 400         | `BadRequestError`          |\n| 401         | `AuthenticationError`      |\n| 403         | `PermissionDeniedError`    |\n| 404         | `NotFoundError`            |\n| 422         | `UnprocessableEntityError` |\n| 429         | `RateLimitError`           |\n| >=500       | `InternalServerError`      |\n| N/A         | `APIConnectionError`       |\n\n### Retries\n\nCertain errors are automatically retried 2 times by default, with a short exponential backoff.\nConnection errors (for example, due to a network connectivity problem), 408 Request Timeout, 409 Conflict,\n429 Rate Limit, and >=500 Internal errors are all retried by default.\n\nYou can use the `max_retries` option to configure or disable retry settings:\n\n```python\nfrom aiinbx import AIInbx\n\n# Configure the default for all requests:\nclient = AIInbx(\n    # default is 2\n    max_retries=0,\n)\n\n# Or, configure per-request:\nclient.with_options(max_retries = 5).threads.search()\n```\n\n### Timeouts\n\nBy default requests time out after 1 minute. You can configure this with a `timeout` option,\nwhich accepts a float or an [`httpx.Timeout`](https://www.python-httpx.org/advanced/timeouts/#fine-tuning-the-configuration) object:\n\n```python\nfrom aiinbx import AIInbx\n\n# Configure the default for all requests:\nclient = AIInbx(\n    # 20 seconds (default is 1 minute)\n    timeout=20.0,\n)\n\n# More granular control:\nclient = AIInbx(\n    timeout=httpx.Timeout(60.0, read=5.0, write=10.0, connect=2.0),\n)\n\n# Override per-request:\nclient.with_options(timeout = 5.0).threads.search()\n```\n\nOn timeout, an `APITimeoutError` is thrown.\n\nNote that requests that time out are [retried twice by default](#retries).\n\n\n\n## Advanced\n\n### Logging\n\nWe use the standard library [`logging`](https://docs.python.org/3/library/logging.html) module.\n\nYou can enable logging by setting the environment variable `AI_INBX_LOG` to `info`.\n\n```shell\n$ export AI_INBX_LOG=info\n```\n\nOr to `debug` for more verbose logging.\n\n### How to tell whether `None` means `null` or missing\n\nIn an API response, a field may be explicitly `null`, or missing entirely; in either case, its value is `None` in this library. You can differentiate the two cases with `.model_fields_set`:\n\n```py\nif response.my_field is None:\n  if \'my_field\' not in response.model_fields_set:\n    print(\'Got json like {}, without a "my_field" key present at all.\')\n  else:\n    print(\'Got json like {"my_field": null}.\')\n```\n\n### Accessing raw response data (e.g. headers)\n\nThe "raw" Response object can be accessed by prefixing `.with_raw_response.` to any HTTP method call, e.g.,\n\n```py\nfrom aiinbx import AIInbx\n\nclient = AIInbx()\nresponse = client.threads.with_raw_response.search()\nprint(response.headers.get(\'X-My-Header\'))\n\nthread = response.parse()  # get the object that `threads.search()` would have returned\nprint(thread.pagination)\n```\n\nThese methods return an [`APIResponse`](https://github.com/aiinbx/aiinbx-py/tree/main/src/aiinbx/_response.py) object.\n\nThe async client returns an [`AsyncAPIResponse`](https://github.com/aiinbx/aiinbx-py/tree/main/src/aiinbx/_response.py) with the same structure, the only difference being `await`able methods for reading the response content.\n\n#### `.with_streaming_response`\n\nThe above interface eagerly reads the full response body when you make the request, which may not always be what you want.\n\nTo stream the response body, use `.with_streaming_response` instead, which requires a context manager and only reads the response body once you call `.read()`, `.text()`, `.json()`, `.iter_bytes()`, `.iter_text()`, `.iter_lines()` or `.parse()`. In the async client, these are async methods.\n\n```python\nwith client.threads.with_streaming_response.search() as response :\n    print(response.headers.get(\'X-My-Header\'))\n\n    for line in response.iter_lines():\n      print(line)\n```\n\nThe context manager is required so that the response will reliably be closed.\n\n### Making custom/undocumented requests\n\nThis library is typed for convenient access to the documented API.\n\nIf you need to access undocumented endpoints, params, or response properties, the library can still be used.\n\n#### Undocumented endpoints\n\nTo make requests to undocumented endpoints, you can make requests using `client.get`, `client.post`, and other\nhttp verbs. Options on the client will be respected (such as retries) when making this request.\n\n```py\nimport httpx\n\nresponse = client.post(\n    "/foo",\n    cast_to=httpx.Response,\n    body={"my_param": True},\n)\n\nprint(response.headers.get("x-foo"))\n```\n\n#### Undocumented request params\n\nIf you want to explicitly send an extra param, you can do so with the `extra_query`, `extra_body`, and `extra_headers` request\noptions.\n\n#### Undocumented response properties\n\nTo access undocumented response properties, you can access the extra fields like `response.unknown_prop`. You\ncan also get all the extra fields on the Pydantic model as a dict with\n[`response.model_extra`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.BaseModel.model_extra).\n\n### Configuring the HTTP client\n\nYou can directly override the [httpx client](https://www.python-httpx.org/api/#client) to customize it for your use case, including:\n\n- Support for [proxies](https://www.python-httpx.org/advanced/proxies/)\n- Custom [transports](https://www.python-httpx.org/advanced/transports/)\n- Additional [advanced](https://www.python-httpx.org/advanced/clients/) functionality\n\n```python\nimport httpx\nfrom aiinbx import AIInbx, DefaultHttpxClient\n\nclient = AIInbx(\n    # Or use the `AI_INBX_BASE_URL` env var\n    base_url="http://my.test.server.example.com:8083",\n    http_client=DefaultHttpxClient(proxy="http://my.test.proxy.example.com", transport=httpx.HTTPTransport(local_address="0.0.0.0")),\n)\n```\n\nYou can also customize the client on a per-request basis by using `with_options()`:\n\n```python\nclient.with_options(http_client=DefaultHttpxClient(...))\n```\n\n### Managing HTTP resources\n\nBy default the library closes underlying HTTP connections whenever the client is [garbage collected](https://docs.python.org/3/reference/datamodel.html#object.__del__). You can manually close the client using the `.close()` method if desired, or with a context manager that closes when exiting.\n\n```py\nfrom aiinbx import AIInbx\n\nwith AIInbx() as client:\n  # make requests here\n  ...\n\n# HTTP client is now closed\n```\n\n## Versioning\n\nThis package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:\n\n1. Changes that only affect static types, without breaking runtime behavior.\n2. Changes to library internals which are technically public but not intended or documented for external use. _(Please open a GitHub issue to let us know if you are relying on such internals.)_\n3. Changes that we do not expect to impact the vast majority of users in practice.\n\nWe take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.\n\nWe are keen for your feedback; please open an [issue](https://www.github.com/aiinbx/aiinbx-py/issues) with questions, bugs, or suggestions.\n\n### Determining the installed version\n\nIf you\'ve upgraded to the latest version but aren\'t seeing any new features you were expecting then your python environment is likely still using an older version.\n\nYou can determine the version that is being used at runtime with:\n\n```py\nimport aiinbx\nprint(aiinbx.__version__)\n```\n\n## Requirements\n\nPython 3.9 or higher.\n\n## Contributing\n\nSee [the contributing documentation](./CONTRIBUTING.md).\n',
  },
  {
    language: 'typescript',
    content:
      "# AI Inbx TypeScript API Library\n\n[![NPM version](https://img.shields.io/npm/v/aiinbx.svg?label=npm%20(stable))](https://npmjs.org/package/aiinbx) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/aiinbx)\n\nThis library provides convenient access to the AI Inbx REST API from server-side TypeScript or JavaScript.\n\n\n\nThe full API of this library can be found in [api.md](api.md).\n\nIt is generated with [Stainless](https://www.stainless.com/).\n\n## MCP Server\n\nUse the AI Inbx MCP Server to enable AI assistants to interact with this API, allowing them to explore endpoints, make test requests, and use documentation to help integrate this SDK into your application.\n\n[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=aiinbx-mcp&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImFpaW5ieC1tY3AiXSwiZW52Ijp7IkFJX0lOQlhfQVBJX0tFWSI6Ik15IEFQSSBLZXkifX0)\n[![Install in VS Code](https://img.shields.io/badge/_-Add_to_VS_Code-blue?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iI0VFRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMzAuMjM1IDM5Ljg4NGEyLjQ5MSAyLjQ5MSAwIDAgMS0xLjc4MS0uNzNMMTIuNyAyNC43OGwtMy40NiAyLjYyNC0zLjQwNiAyLjU4MmExLjY2NSAxLjY2NSAwIDAgMS0xLjA4Mi4zMzggMS42NjQgMS42NjQgMCAwIDEtMS4wNDYtLjQzMWwtMi4yLTJhMS42NjYgMS42NjYgMCAwIDEgMC0yLjQ2M0w3LjQ1OCAyMCA0LjY3IDE3LjQ1MyAxLjUwNyAxNC41N2ExLjY2NSAxLjY2NSAwIDAgMSAwLTIuNDYzbDIuMi0yYTEuNjY1IDEuNjY1IDAgMCAxIDIuMTMtLjA5N2w2Ljg2MyA1LjIwOUwyOC40NTIuODQ0YTIuNDg4IDIuNDg4IDAgMCAxIDEuODQxLS43MjljLjM1MS4wMDkuNjk5LjA5MSAxLjAxOS4yNDVsOC4yMzYgMy45NjFhMi41IDIuNSAwIDAgMSAxLjQxNSAyLjI1M3YuMDk5LS4wNDVWMzMuMzd2LS4wNDUuMDk1YTIuNTAxIDIuNTAxIDAgMCAxLTEuNDE2IDIuMjU3bC04LjIzNSAzLjk2MWEyLjQ5MiAyLjQ5MiAwIDAgMS0xLjA3Ny4yNDZabS43MTYtMjguOTQ3LTExLjk0OCA5LjA2MiAxMS45NTIgOS4wNjUtLjAwNC0xOC4xMjdaIi8+PC9zdmc+)](https://vscode.stainless.com/mcp/%7B%22name%22%3A%22aiinbx-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22aiinbx-mcp%22%5D%2C%22env%22%3A%7B%22AI_INBX_API_KEY%22%3A%22My%20API%20Key%22%7D%7D)\n\n> Note: You may need to set environment variables in your MCP client.\n\n## Installation\n\n```sh\nnpm install aiinbx\n```\n\n\n\n## Usage\n\nThe full API of this library can be found in [api.md](api.md).\n\n<!-- prettier-ignore -->\n```js\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.threads.search();\n\nconsole.log(response.pagination);\n```\n\n\n\n### Request & Response types\n\nThis library includes TypeScript definitions for all request params and response fields. You may import and use them like so:\n\n<!-- prettier-ignore -->\n```ts\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  apiKey: process.env['AI_INBX_API_KEY'], // This is the default and can be omitted\n});\n\nconst response: AIInbx.ThreadSearchResponse = await client.threads.search();\n```\n\nDocumentation for each method, request param, and response field are available in docstrings and will appear on hover in most modern editors.\n\n\n\n\n\n## Handling errors\n\nWhen the library is unable to connect to the API,\nor if the API returns a non-success status code (i.e., 4xx or 5xx response),\na subclass of `APIError` will be thrown:\n\n<!-- prettier-ignore -->\n```ts\nconst response = await client.threads.search().catch(async (err) => {\n  if (err instanceof AIInbx.APIError) {\n    console.log(err.status); // 400\n    console.log(err.name); // BadRequestError\n    console.log(err.headers); // {server: 'nginx', ...}\n  } else {\n    throw err;\n  }\n});\n```\n\nError codes are as follows:\n\n| Status Code | Error Type                 |\n| ----------- | -------------------------- |\n| 400         | `BadRequestError`          |\n| 401         | `AuthenticationError`      |\n| 403         | `PermissionDeniedError`    |\n| 404         | `NotFoundError`            |\n| 422         | `UnprocessableEntityError` |\n| 429         | `RateLimitError`           |\n| >=500       | `InternalServerError`      |\n| N/A         | `APIConnectionError`       |\n\n### Retries\n\nCertain errors will be automatically retried 2 times by default, with a short exponential backoff.\nConnection errors (for example, due to a network connectivity problem), 408 Request Timeout, 409 Conflict,\n429 Rate Limit, and >=500 Internal errors will all be retried by default.\n\nYou can use the `maxRetries` option to configure or disable this:\n\n<!-- prettier-ignore -->\n```js\n// Configure the default for all requests:\nconst client = new AIInbx({\n  maxRetries: 0, // default is 2\n});\n\n// Or, configure per-request:\nawait client.threads.search({\n  maxRetries: 5,\n});\n```\n\n### Timeouts\n\nRequests time out after 1 minute by default. You can configure this with a `timeout` option:\n\n<!-- prettier-ignore -->\n```ts\n// Configure the default for all requests:\nconst client = new AIInbx({\n  timeout: 20 * 1000, // 20 seconds (default is 1 minute)\n});\n\n// Override per-request:\nawait client.threads.search({\n  timeout: 5 * 1000,\n});\n```\n\nOn timeout, an `APIConnectionTimeoutError` is thrown.\n\nNote that requests which time out will be [retried twice by default](#retries).\n\n\n\n\n\n## Advanced Usage\n\n### Accessing raw Response data (e.g., headers)\n\nThe \"raw\" `Response` returned by `fetch()` can be accessed through the `.asResponse()` method on the `APIPromise` type that all methods return.\nThis method returns as soon as the headers for a successful response are received and does not consume the response body, so you are free to write custom parsing or streaming logic.\n\nYou can also use the `.withResponse()` method to get the raw `Response` along with the parsed data.\nUnlike `.asResponse()` this method consumes the body, returning once it is parsed.\n\n<!-- prettier-ignore -->\n```ts\nconst client = new AIInbx();\n\nconst response = await client.threads.search().asResponse();\nconsole.log(response.headers.get('X-My-Header'));\nconsole.log(response.statusText); // access the underlying Response object\n\nconst { data: response, response: raw } = await client.threads.search().withResponse();\nconsole.log(raw.headers.get('X-My-Header'));\nconsole.log(response.pagination);\n```\n\n### Logging\n\n> [!IMPORTANT]\n> All log messages are intended for debugging only. The format and content of log messages\n> may change between releases.\n\n#### Log levels\n\nThe log level can be configured in two ways:\n\n1. Via the `AI_INBX_LOG` environment variable\n2. Using the `logLevel` client option (overrides the environment variable if set)\n\n```ts\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  logLevel: 'debug', // Show all log messages\n});\n```\n\nAvailable log levels, from most to least verbose:\n\n- `'debug'` - Show debug messages, info, warnings, and errors\n- `'info'` - Show info messages, warnings, and errors\n- `'warn'` - Show warnings and errors (default)\n- `'error'` - Show only errors\n- `'off'` - Disable all logging\n\nAt the `'debug'` level, all HTTP requests and responses are logged, including headers and bodies.\nSome authentication-related headers are redacted, but sensitive data in request and response bodies\nmay still be visible.\n\n#### Custom logger\n\nBy default, this library logs to `globalThis.console`. You can also provide a custom logger.\nMost logging libraries are supported, including [pino](https://www.npmjs.com/package/pino), [winston](https://www.npmjs.com/package/winston), [bunyan](https://www.npmjs.com/package/bunyan), [consola](https://www.npmjs.com/package/consola), [signale](https://www.npmjs.com/package/signale), and [@std/log](https://jsr.io/@std/log). If your logger doesn't work, please open an issue.\n\nWhen providing a custom logger, the `logLevel` option still controls which messages are emitted, messages\nbelow the configured level will not be sent to your logger.\n\n```ts\nimport AIInbx from 'aiinbx';\nimport pino from 'pino';\n\nconst logger = pino();\n\nconst client = new AIInbx({\n  logger: logger.child({ name: 'AIInbx' }),\n  logLevel: 'debug', // Send all messages to pino, allowing it to filter\n});\n```\n\n### Making custom/undocumented requests\n\nThis library is typed for convenient access to the documented API. If you need to access undocumented\nendpoints, params, or response properties, the library can still be used.\n\n#### Undocumented endpoints\n\nTo make requests to undocumented endpoints, you can use `client.get`, `client.post`, and other HTTP verbs.\nOptions on the client, such as retries, will be respected when making these requests.\n\n```ts\nawait client.post('/some/path', {\n  body: { some_prop: 'foo' },\n  query: { some_query_arg: 'bar' },\n});\n```\n\n#### Undocumented request params\n\nTo make requests using undocumented parameters, you may use `// @ts-expect-error` on the undocumented\nparameter. This library doesn't validate at runtime that the request matches the type, so any extra values you\nsend will be sent as-is.\n\n```ts\nclient.threads.search({\n  // ...\n  // @ts-expect-error baz is not yet public\n  baz: 'undocumented option',\n});\n```\n\nFor requests with the `GET` verb, any extra params will be in the query, all other requests will send the\nextra param in the body.\n\nIf you want to explicitly send an extra argument, you can do so with the `query`, `body`, and `headers` request\noptions.\n\n#### Undocumented response properties\n\nTo access undocumented response properties, you may access the response object with `// @ts-expect-error` on\nthe response object, or cast the response object to the requisite type. Like the request params, we do not\nvalidate or strip extra properties from the response from the API.\n\n### Customizing the fetch client\n\nBy default, this library expects a global `fetch` function is defined.\n\nIf you want to use a different `fetch` function, you can either polyfill the global:\n\n```ts\nimport fetch from 'my-fetch';\n\nglobalThis.fetch = fetch;\n```\n\nOr pass it to the client:\n\n```ts\nimport AIInbx from 'aiinbx';\nimport fetch from 'my-fetch';\n\nconst client = new AIInbx({ fetch });\n```\n\n### Fetch options\n\nIf you want to set custom `fetch` options without overriding the `fetch` function, you can provide a `fetchOptions` object when instantiating the client or making a request. (Request-specific options override client options.)\n\n```ts\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  fetchOptions: {\n    // `RequestInit` options\n  },\n});\n```\n\n#### Configuring proxies\n\nTo modify proxy behavior, you can provide custom `fetchOptions` that add runtime-specific proxy\noptions to requests:\n\n<img src=\"https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/node.svg\" align=\"top\" width=\"18\" height=\"21\"> **Node** <sup>[[docs](https://github.com/nodejs/undici/blob/main/docs/docs/api/ProxyAgent.md#example---proxyagent-with-fetch)]</sup>\n\n```ts\nimport AIInbx from 'aiinbx';\nimport * as undici from 'undici';\n\nconst proxyAgent = new undici.ProxyAgent('http://localhost:8888');\nconst client = new AIInbx({\n  fetchOptions: {\n    dispatcher: proxyAgent,\n  },\n});\n```\n\n<img src=\"https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/bun.svg\" align=\"top\" width=\"18\" height=\"21\"> **Bun** <sup>[[docs](https://bun.sh/guides/http/proxy)]</sup>\n\n```ts\nimport AIInbx from 'aiinbx';\n\nconst client = new AIInbx({\n  fetchOptions: {\n    proxy: 'http://localhost:8888',\n  },\n});\n```\n\n<img src=\"https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/deno.svg\" align=\"top\" width=\"18\" height=\"21\"> **Deno** <sup>[[docs](https://docs.deno.com/api/deno/~/Deno.createHttpClient)]</sup>\n\n```ts\nimport AIInbx from 'npm:aiinbx';\n\nconst httpClient = Deno.createHttpClient({ proxy: { url: 'http://localhost:8888' } });\nconst client = new AIInbx({\n  fetchOptions: {\n    client: httpClient,\n  },\n});\n```\n\n## Frequently Asked Questions\n\n## Semantic versioning\n\nThis package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:\n\n1. Changes that only affect static types, without breaking runtime behavior.\n2. Changes to library internals which are technically public but not intended or documented for external use. _(Please open a GitHub issue to let us know if you are relying on such internals.)_\n3. Changes that we do not expect to impact the vast majority of users in practice.\n\nWe take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.\n\nWe are keen for your feedback; please open an [issue](https://www.github.com/aiinbx/aiinbx-ts/issues) with questions, bugs, or suggestions.\n\n## Requirements\n\nTypeScript >= 4.9 is supported.\n\nThe following runtimes are supported:\n\n- Web browsers (Up-to-date Chrome, Firefox, Safari, Edge, and more)\n- Node.js 20 LTS or later ([non-EOL](https://endoflife.date/nodejs)) versions.\n- Deno v1.28.0 or higher.\n- Bun 1.0 or later.\n- Cloudflare Workers.\n- Vercel Edge Runtime.\n- Jest 28 or greater with the `\"node\"` environment (`\"jsdom\"` is not supported at this time).\n- Nitro v2.6 or greater.\n\nNote that React Native is not supported at this time.\n\nIf you are interested in other runtime environments, please open or upvote an issue on GitHub.\n\n## Contributing\n\nSee [the contributing documentation](./CONTRIBUTING.md).\n",
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
    fuzzy: 0.1,
    boost: {
      name: 5,
      stainlessPath: 3,
      endpoint: 3,
      qualified: 3,
      summary: 2,
      content: 1,
      description: 1,
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
    for (const readme of EMBEDDED_READMES) {
      instance.indexProse(readme.content, `readme:${readme.language}`);
    }
    if (opts?.docsDir) {
      await instance.loadDocsDirectory(opts.docsDir);
    }
    return instance;
  }

  search(props: {
    query: string;
    language?: string;
    detail?: string;
    maxResults?: number;
    maxLength?: number;
  }): SearchResult {
    const { query, language = 'typescript', detail = 'default', maxResults = 5, maxLength = 100_000 } = props;

    const useMarkdown = detail === 'verbose' || detail === 'high';

    // Search both indices and merge results by score.
    // Filter prose hits so language-tagged content (READMEs and docs with
    // frontmatter) only matches the requested language.
    const methodHits = this.methodIndex
      .search(query)
      .map((hit) => ({ ...hit, _kind: 'http_method' as const }));
    const proseHits = this.proseIndex
      .search(query)
      .filter((hit) => {
        const source = ((hit as Record<string, unknown>)['_original'] as ProseChunk | undefined)?.source;
        if (!source) return true;
        // Check for language-tagged sources: "readme:<lang>" or "lang:<lang>:<filename>"
        let taggedLang: string | undefined;
        if (source.startsWith('readme:')) taggedLang = source.slice('readme:'.length);
        else if (source.startsWith('lang:')) taggedLang = source.split(':')[1];
        if (!taggedLang) return true;
        return taggedLang === language || (language === 'javascript' && taggedLang === 'typescript');
      })
      .map((hit) => ({ ...hit, _kind: 'prose' as const }));
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
          // Use per-language data when available, falling back to the
          // top-level fields (which are TypeScript-specific in the
          // legacy codepath).
          const langData = m.perLanguage?.[language];
          fullResults.push({
            method: langData?.method ?? m.qualified,
            summary: m.summary,
            description: m.description,
            endpoint: `${m.httpMethod.toUpperCase()} ${m.endpoint}`,
            ...(langData?.example ? { example: langData.example } : {}),
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
          // Parse optional YAML frontmatter for language tagging.
          // Files with a "language" field in frontmatter will only
          // surface in searches for that language.
          //
          // Example:
          //   ---
          //   language: python
          //   ---
          //   # Error handling in Python
          //   ...
          const frontmatter = parseFrontmatter(content);
          const source = frontmatter.language ? `lang:${frontmatter.language}:${file.name}` : file.name;
          this.indexProse(content, source);
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

/** Parses YAML frontmatter from a markdown string, extracting the language field if present. */
function parseFrontmatter(markdown: string): { language?: string } {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const body = match[1] ?? '';
  const langMatch = body.match(/^language:\s*(.+)$/m);
  return langMatch ? { language: langMatch[1]!.trim() } : {};
}
