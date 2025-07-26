// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { Aiinbx } from '../client';

export abstract class APIResource {
  protected _client: Aiinbx;

  constructor(client: Aiinbx) {
    this._client = client;
  }
}
