// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import AIInbx from 'ai-inbx';

const client = new AIInbx({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource emails', () => {
  // skipped: tests are disabled for the time being
  test.skip('retrieve', async () => {
    const responsePromise = client.emails.retrieve('emailId');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // skipped: tests are disabled for the time being
  test.skip('reply: only required params', async () => {
    const responsePromise = client.emails.reply('emailId', { from: 'dev@stainless.com', html: 'html' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // skipped: tests are disabled for the time being
  test.skip('reply: required and optional params', async () => {
    const response = await client.emails.reply('emailId', {
      from: 'dev@stainless.com',
      html: 'html',
      bcc: 'dev@stainless.com',
      cc: 'dev@stainless.com',
      from_name: 'from_name',
      reply_all: true,
      subject: 'subject',
      text: 'text',
      to: 'dev@stainless.com',
    });
  });

  // skipped: tests are disabled for the time being
  test.skip('send: only required params', async () => {
    const responsePromise = client.emails.send({
      from: 'dev@stainless.com',
      html: 'html',
      subject: 'subject',
      to: 'dev@stainless.com',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // skipped: tests are disabled for the time being
  test.skip('send: required and optional params', async () => {
    const response = await client.emails.send({
      from: 'dev@stainless.com',
      html: 'html',
      subject: 'subject',
      to: 'dev@stainless.com',
      bcc: 'dev@stainless.com',
      cc: 'dev@stainless.com',
      from_name: 'from_name',
      in_reply_to: 'in_reply_to',
      references: ['string'],
      reply_to: 'dev@stainless.com',
      text: 'text',
      threadId: 'threadId',
    });
  });
});
