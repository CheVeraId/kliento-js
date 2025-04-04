import { Chain, SignatureBundle } from '@relaycorp/veraid';

import { KLIENTO_SERVICE_OID, MAX_TOKEN_BUNDLE_OCTETS } from './serviceConfig.js';
import { Token } from './Token.js';
import { TokenBundleOptions } from './TokenBundleOptions.js';

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
}
