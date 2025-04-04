import { Chain, SignatureBundle } from '@relaycorp/veraid';

import { KLIENTO_SERVICE_OID } from './serviceConfig.js';
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
}
