import type { ClaimSet } from './ClaimSet.js';

/**
 * The result of verifying a token bundle.
 */
export interface TokenBundleVerificationResult {
  /**
   * The claims in the token bundle.
   */
  readonly claims: ClaimSet;
}
