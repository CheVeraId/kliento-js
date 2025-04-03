import { TokenClaimSchema } from './schemas/TokenClaimSchema.js';

import { AsnSerializer } from '@peculiar/asn1-schema';
import { TokenSchema } from './schemas/TokenSchema.js';
import { TokenClaimSetSchema } from './schemas/TokenClaimSetSchema.js';

/**
 * Kliento token.
 */
export class Token {
  /**
   * Create a new token.
   * @param audience - The audience of the token.
   * @param claims - The claims of the token.
   */
  constructor(
    public readonly audience: string,
    public readonly claims?: Record<string, string>,
  ) {}

  /**
   * Serialise the token.
   * @returns The serialised token.
   */
  public serialise(): ArrayBuffer {
    const schema = new TokenSchema();
    schema.audience = this.audience;

    const claims = this.claims ? Object.entries(this.claims) : [];
    if (claims.length) {
      const claimSchemas = claims.map(([key, value]) => {
        const claim = new TokenClaimSchema();
        claim.key = key;
        claim.value = value;
        return claim;
      });
      schema.claims = new TokenClaimSetSchema(claimSchemas);
    }

    return AsnSerializer.serialize(schema);
  }
}
