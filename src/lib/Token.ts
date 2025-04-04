import { AsnParser, AsnSerializer } from '@peculiar/asn1-schema';

import { ClaimSet } from './ClaimSet.js';
import { TokenClaimSchema } from './schemas/TokenClaimSchema.js';
import { TokenClaimSetSchema } from './schemas/TokenClaimSetSchema.js';
import { TokenSchema } from './schemas/TokenSchema.js';

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
    public readonly claims?: ClaimSet,
  ) {}

  /**
   * Deserialise a token.
   * @param serialisation - The serialised token.
   * @returns The deserialised token.
   * @throws If the serialisation is malformed.
   */
  public static deserialise(serialisation: ArrayBuffer): Token {
    let schema: TokenSchema;
    try {
      schema = AsnParser.parse(serialisation, TokenSchema);
    } catch (error) {
      throw new Error('Invalid token serialisation', { cause: error });
    }

    const claims = schema.claims
      ? Object.fromEntries(schema.claims.map((claim) => [claim.key, claim.value]))
      : undefined;

    return new Token(schema.audience, claims);
  }

  /**
   * Serialise the token.
   * @returns The serialised token.
   */
  public serialise(): ArrayBuffer {
    const schema = new TokenSchema();
    schema.audience = this.audience;

    const claims = this.claims ? Object.entries(this.claims) : [];
    if (claims.length > 0) {
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
