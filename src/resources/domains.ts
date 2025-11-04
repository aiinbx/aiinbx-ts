// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Domains extends APIResource {
  /**
   * Create a new domain for the organization and return required DNS records to
   * configure.
   */
  create(body: DomainCreateParams, options?: RequestOptions): APIPromise<DomainCreateResponse> {
    return this._client.post('/domains', { body, ...options });
  }

  /**
   * Retrieve a domain by its ID
   */
  retrieve(domainID: string, options?: RequestOptions): APIPromise<DomainRetrieveResponse> {
    return this._client.get(path`/domains/${domainID}`, options);
  }

  /**
   * List all domains belonging to the API key's organization
   */
  list(options?: RequestOptions): APIPromise<DomainListResponse> {
    return this._client.get('/domains', options);
  }

  /**
   * Delete a domain by ID from the organization
   */
  delete(domainID: string, options?: RequestOptions): APIPromise<DomainDeleteResponse> {
    return this._client.delete(path`/domains/${domainID}`, options);
  }

  /**
   * Run verification checks for the domain and update its stored status and DNS
   * record verification flags.
   */
  verify(domainID: string, options?: RequestOptions): APIPromise<DomainVerifyResponse> {
    return this._client.post(path`/domains/${domainID}/verify`, options);
  }
}

export interface DomainCreateResponse {
  domainId: string;

  records: Array<DomainCreateResponse.Record>;
}

export namespace DomainCreateResponse {
  export interface Record {
    name: string;

    type: 'TXT' | 'CNAME' | 'MX';

    value: string;

    priority?: number;
  }
}

export interface DomainRetrieveResponse {
  id: string;

  createdAt: string;

  domain: string;

  isManagedDefault: boolean;

  status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED';

  updatedAt: string;

  verifiedAt: string | null;

  dnsRecords?: Array<DomainRetrieveResponse.DNSRecord> | null;
}

export namespace DomainRetrieveResponse {
  export interface DNSRecord {
    name: string;

    type: 'TXT' | 'CNAME' | 'MX';

    value: string;

    isVerified?: boolean;

    lastCheckedAt?: string;

    priority?: number;

    verificationStatus?: 'verified' | 'missing' | 'pending';
  }
}

export interface DomainListResponse {
  domains: Array<DomainListResponse.Domain>;
}

export namespace DomainListResponse {
  export interface Domain {
    id: string;

    createdAt: string;

    domain: string;

    isManagedDefault: boolean;

    status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED';

    updatedAt: string;

    verifiedAt: string | null;

    dnsRecords?: Array<Domain.DNSRecord> | null;
  }

  export namespace Domain {
    export interface DNSRecord {
      name: string;

      type: 'TXT' | 'CNAME' | 'MX';

      value: string;

      isVerified?: boolean;

      lastCheckedAt?: string;

      priority?: number;

      verificationStatus?: 'verified' | 'missing' | 'pending';
    }
  }
}

export interface DomainDeleteResponse {
  success: true;
}

export interface DomainVerifyResponse {
  domain: DomainVerifyResponse.Domain;

  verification: DomainVerifyResponse.Verification;
}

export namespace DomainVerifyResponse {
  export interface Domain {
    id: string;

    createdAt: string;

    domain: string;

    isManagedDefault: boolean;

    status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NOT_REGISTERED';

    updatedAt: string;

    verifiedAt: string | null;

    dnsRecords?: Array<Domain.DNSRecord> | null;
  }

  export namespace Domain {
    export interface DNSRecord {
      name: string;

      type: 'TXT' | 'CNAME' | 'MX';

      value: string;

      isVerified?: boolean;

      lastCheckedAt?: string;

      priority?: number;

      verificationStatus?: 'verified' | 'missing' | 'pending';
    }
  }

  export interface Verification {
    debug: Verification.Debug;

    dkimStatus: 'Pending' | 'Success' | 'Failed' | 'NotStarted' | 'TemporaryFailure';

    dns: Verification.DNS;

    mxConflict: Verification.MxConflict;

    ready: boolean;

    verification: 'Pending' | 'Success' | 'Failed' | 'NotStarted' | 'TemporaryFailure';
  }

  export namespace Verification {
    export interface Debug {
      actualVerificationTokens: Array<string>;

      domain: string;

      verificationTokenMatch: boolean;

      expectedVerificationToken?: string;
    }

    export interface DNS {
      dkim: { [key: string]: boolean };

      dmarc: DNS.Dmarc;

      domainVerification: boolean;

      mailFrom: DNS.MailFrom;

      mx: DNS.Mx;

      spf: boolean;
    }

    export namespace DNS {
      export interface Dmarc {
        present: boolean;

        source: 'subdomain' | 'parent' | 'none';
      }

      export interface MailFrom {
        domain: string;

        mx: boolean;

        spf: boolean;
      }

      export interface Mx {
        expectedPriority: number;

        found: boolean;

        records: Array<Mx.Record>;
      }

      export namespace Mx {
        export interface Record {
          exchange: string;

          priority: number;
        }
      }
    }

    export interface MxConflict {
      hasConflict: boolean;

      conflictingRecords?: Array<MxConflict.ConflictingRecord>;

      message?: string;
    }

    export namespace MxConflict {
      export interface ConflictingRecord {
        exchange: string;

        priority: number;
      }
    }
  }
}

export interface DomainCreateParams {
  domain: string;
}

export declare namespace Domains {
  export {
    type DomainCreateResponse as DomainCreateResponse,
    type DomainRetrieveResponse as DomainRetrieveResponse,
    type DomainListResponse as DomainListResponse,
    type DomainDeleteResponse as DomainDeleteResponse,
    type DomainVerifyResponse as DomainVerifyResponse,
    type DomainCreateParams as DomainCreateParams,
  };
}
