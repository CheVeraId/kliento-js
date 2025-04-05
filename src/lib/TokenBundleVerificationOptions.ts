import type { TrustAnchor } from '@relaycorp/veraid';

/**
 * Options for verifying a token bundle.
 */
export interface TokenBundleVerificationOptions {
  /**
   * The date against which to verify the token bundle.
   */
  readonly date: Date;

  /**
   * The DNSSEC trust anchors against which to verify the token bundle.
   */
  readonly trustAnchors: readonly TrustAnchor[];
}
