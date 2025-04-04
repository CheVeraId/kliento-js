import type { Member } from '@relaycorp/veraid';

import type { ClaimSet } from './ClaimSet.js';

/**
 * The result of verifying a token bundle.
 */
export interface TokenBundleVerificationResult {
  /**
   * The claims in the token bundle.
   */
  readonly claims: ClaimSet;

  /**
   * The member that signed the token bundle.
   */
  readonly member: Member;
}
