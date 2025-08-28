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
