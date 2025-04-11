import type { ClaimSet } from './ClaimSet.js';

/**
 * The result of verifying a token bundle.
 */
export interface TokenBundleVerification {
  /**
   * The claims in the token bundle.
   */
  readonly claims: ClaimSet;

  /**
   * The id of the member that signed the token bundle.
   *
   * For example, `example.com` or `alice@example.com`.
   */
  readonly subjectId: string;
}
