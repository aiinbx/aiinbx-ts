// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { AIInbx } from '../client';

export abstract class APIResource {
  protected _client: AIInbx;

  constructor(client: AIInbx) {
    this._client = client;
  }
}
