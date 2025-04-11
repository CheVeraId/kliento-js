import { ClaimSet } from './ClaimSet.js';
import { isValidToken } from './TokenSchema.js';

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
    public readonly claims: ClaimSet = {},
  ) {}

  /**
   * Deserialise a token.
   * @param serialisation - The serialised token.
   * @returns The deserialised token.
   * @throws If the serialisation is malformed.
   */
  public static deserialise(serialisation: ArrayBuffer): Token {
    const string = new TextDecoder().decode(serialisation);

    let tokenDoc: unknown;

    try {
      tokenDoc = JSON.parse(string);
    } catch (error) {
      throw new Error('Malformed JSON value', {
        cause: error,
      });
    }

    if (!isValidToken(tokenDoc)) {
      throw new Error('Invalid token serialisation');
    }

    const claims = tokenDoc.claims ?? {};

    return new Token(tokenDoc.audience, claims);
  }

  /**
   * Serialise the token.
   * @returns The serialised token.
   */
  public serialise(): ArrayBuffer {
    const claimsAttribute = Object.keys(this.claims).length > 0 ? this.claims : undefined;
    const tokenDoc = {
      audience: this.audience,
      claims: claimsAttribute,
    };

    return new TextEncoder().encode(JSON.stringify(tokenDoc));
  }
}
