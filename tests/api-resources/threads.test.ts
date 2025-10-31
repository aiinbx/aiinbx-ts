// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import AIInbx from 'aiinbx';

const client = new AIInbx({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource threads', () => {
  // Prism tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.threads.retrieve('threadId');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('forward: only required params', async () => {
    const responsePromise = client.threads.forward('threadId', { to: 'dev@stainless.com' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('forward: required and optional params', async () => {
    const response = await client.threads.forward('threadId', {
      to: 'dev@stainless.com',
      attachments: [
        {
          content: 'content',
          file_name: 'file_name',
          cid: 'cid',
          content_type: 'content_type',
          disposition: 'attachment',
        },
      ],
      bcc: 'dev@stainless.com',
      cc: 'dev@stainless.com',
      from: 'dev@stainless.com',
      from_name: 'from_name',
      includeAttachments: true,
      is_draft: true,
      note: 'note',
    });
  });

  // Prism tests are disabled
  test.skip('search', async () => {
    const responsePromise = client.threads.search({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
