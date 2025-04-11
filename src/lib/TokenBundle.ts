import { Chain, type Member, SignatureBundle } from '@relaycorp/veraid';

import { KLIENTO_SERVICE_OID, MAX_TOKEN_BUNDLE_OCTETS } from './serviceConfig.js';
import { Token } from './Token.js';
import { TokenBundleOptions } from './TokenBundleOptions.js';
import { TokenBundleVerification } from './TokenBundleVerification.js';
import { TokenBundleVerificationOptions } from './TokenBundleVerificationOptions.js';

const AUTHORIZATION_SCHEME = 'Kliento';
const AUTHORIZATION_VALUE_PREFIX = `${AUTHORIZATION_SCHEME} `.toLowerCase();

/**
 * Kliento token bundle.
 */
export class TokenBundle {
  /**
   * @internal
   */
  public readonly signatureBundle: SignatureBundle;

  protected constructor(signatureBundle: SignatureBundle) {
    this.signatureBundle = signatureBundle;
  }

  /**
   * Deserialise a token bundle.
   * @param serialisation - The serialisation of the token bundle.
   * @returns A new token bundle.
   */
  public static deserialise(serialisation: ArrayBuffer): TokenBundle {
    if (MAX_TOKEN_BUNDLE_OCTETS < serialisation.byteLength) {
      throw new Error(
        'Token bundle serialisation is too large: ' +
          `${serialisation.byteLength} bytes (max ${MAX_TOKEN_BUNDLE_OCTETS} octets)`,
      );
    }

    let tokenBundle: TokenBundle;
    try {
      tokenBundle = new TokenBundle(SignatureBundle.deserialise(serialisation));
    } catch (error) {
      throw new Error('Token serialisation is malformed', { cause: error });
    }

    return tokenBundle;
  }

  /**
   * Deserialise a token bundle from an authorization header.
   * @param header - The authorization header.
   * @returns The token bundle.
   * @throws An error if the authorization scheme is not "Kliento" or the token bundle is malformed.
   *
   * This value requires the scheme "Kliento" and the token bundle to be base64-encoded.
   */
  public static deserialiseFromAuthHeader(header: string): TokenBundle {
    const scheme = header.slice(0, AUTHORIZATION_VALUE_PREFIX.length);
    if (scheme.toLowerCase() !== AUTHORIZATION_VALUE_PREFIX) {
      throw new Error('Authorization scheme must be "Kliento"');
    }

    const token = header.slice(AUTHORIZATION_VALUE_PREFIX.length);

    const tokenBundleSerialised = Buffer.from(token, 'base64');

    try {
      return TokenBundle.deserialise(tokenBundleSerialised);
    } catch (error) {
      throw new Error('Token serialisation is malformed', { cause: error });
    }
  }

  /**
   * Sign a token.
   * @param token - The token to sign.
   * @param privateKey - The private key to sign the token with.
   * @param chain - The chain to sign the token with.
   * @param expiry - The expiry date of the token.
   * @param options - The options for the token bundle.
   * @returns A new token bundle.
   */
  public static async sign(
    token: Token,
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    privateKey: CryptoKey,
    chain: Chain,
    expiry: Date,
    options: Partial<TokenBundleOptions> = {},
  ): Promise<TokenBundle> {
    const plaintext = token.serialise();

    const signatureBundle = await SignatureBundle.sign(
      plaintext,
      KLIENTO_SERVICE_OID,
      chain,
      privateKey,
      expiry,
      { shouldEncapsulatePlaintext: true, startDate: options.startDate },
    );

    return new TokenBundle(signatureBundle);
  }

  /**
   * Serialise the token bundle.
   * @returns The serialised token bundle.
   */
  public serialise(): ArrayBuffer {
    return this.signatureBundle.serialise();
  }

  /**
   * Verify the token bundle.
   * @param audience - The required audience of the token.
   * @param options - Verification options.
   * @param options.date - The date at which to verify the token bundle.
   * @param options.trustAnchors - The trust anchors with which to verify the token bundle.
   * @returns The token claims.
   */
  public async verify(
    audience: string,
    { date, trustAnchors }: Partial<TokenBundleVerificationOptions> = {},
  ): Promise<TokenBundleVerification> {
    let plaintext: ArrayBuffer;
    let member: Member;
    try {
      ({ member, plaintext } = await this.signatureBundle.verify(
        undefined,
        KLIENTO_SERVICE_OID,
        date,
        trustAnchors,
      ));
    } catch (error) {
      throw new Error('Invalid VeraId signature bundle', { cause: error });
    }

    let token: Token;
    try {
      token = Token.deserialise(plaintext);
    } catch (error) {
      throw new Error('Malformed token', { cause: error });
    }

    if (token.audience !== audience) {
      throw new Error(`Audience mismatch: Expected ${audience}, got ${token.audience}`);
    }

    return { claims: token.claims, subject: member };
  }
}
