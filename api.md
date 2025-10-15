# Threads

Types:

- <code><a href="./src/resources/threads.ts">ThreadRetrieveResponse</a></code>
- <code><a href="./src/resources/threads.ts">ThreadForwardResponse</a></code>
- <code><a href="./src/resources/threads.ts">ThreadSearchResponse</a></code>

Methods:

- <code title="get /threads/{threadId}">client.threads.<a href="./src/resources/threads.ts">retrieve</a>(threadID) -> ThreadRetrieveResponse</code>
- <code title="post /threads/{threadId}/forward">client.threads.<a href="./src/resources/threads.ts">forward</a>(threadID, { ...params }) -> ThreadForwardResponse</code>
- <code title="post /threads/search">client.threads.<a href="./src/resources/threads.ts">search</a>({ ...params }) -> ThreadSearchResponse</code>

# Emails

Types:

- <code><a href="./src/resources/emails.ts">EmailRetrieveResponse</a></code>
- <code><a href="./src/resources/emails.ts">EmailReplyResponse</a></code>
- <code><a href="./src/resources/emails.ts">EmailSendResponse</a></code>

Methods:

- <code title="get /emails/{emailId}">client.emails.<a href="./src/resources/emails.ts">retrieve</a>(emailID) -> EmailRetrieveResponse</code>
- <code title="post /emails/{emailId}/reply">client.emails.<a href="./src/resources/emails.ts">reply</a>(emailID, { ...params }) -> EmailReplyResponse</code>
- <code title="post /emails/send">client.emails.<a href="./src/resources/emails.ts">send</a>({ ...params }) -> EmailSendResponse</code>

# Domains

Types:

- <code><a href="./src/resources/domains.ts">DomainCreateResponse</a></code>
- <code><a href="./src/resources/domains.ts">DomainRetrieveResponse</a></code>
- <code><a href="./src/resources/domains.ts">DomainListResponse</a></code>
- <code><a href="./src/resources/domains.ts">DomainDeleteResponse</a></code>
- <code><a href="./src/resources/domains.ts">DomainVerifyResponse</a></code>

Methods:

- <code title="post /domains">client.domains.<a href="./src/resources/domains.ts">create</a>({ ...params }) -> DomainCreateResponse</code>
- <code title="get /domains/{domainId}">client.domains.<a href="./src/resources/domains.ts">retrieve</a>(domainID) -> DomainRetrieveResponse</code>
- <code title="get /domains">client.domains.<a href="./src/resources/domains.ts">list</a>() -> DomainListResponse</code>
- <code title="delete /domains/{domainId}">client.domains.<a href="./src/resources/domains.ts">delete</a>(domainID) -> DomainDeleteResponse</code>
- <code title="post /domains/{domainId}/verify">client.domains.<a href="./src/resources/domains.ts">verify</a>(domainID) -> DomainVerifyResponse</code>

# Webhooks

Types:

- <code><a href="./src/resources/webhooks.ts">InboundEmailReceivedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">OutboundEmailDeliveredWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">OutboundEmailBouncedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">OutboundEmailComplainedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">OutboundEmailRejectedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">OutboundEmailOpenedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">OutboundEmailClickedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">UnwrapWebhookEvent</a></code>

Methods:

- <code>client.webhooks.<a href="./src/resources/webhooks.ts">unwrap</a>(body) -> void</code>

# Meta

Types:

- <code><a href="./src/resources/meta.ts">MetaWebhooksSchemaResponse</a></code>

Methods:

- <code title="get /_meta/webhooks">client.meta.<a href="./src/resources/meta.ts">webhooksSchema</a>() -> MetaWebhooksSchemaResponse</code>
