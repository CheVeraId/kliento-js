import { MockTrustChain } from '@relaycorp/veraid';
import { addMinutes, addSeconds, setMilliseconds, subSeconds } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { KLIENTO_SERVICE_OID } from './serviceConfig.js';
import { AUDIENCE } from './testUtils/klientoStubs.js';
import { ORG_NAME, USER_NAME } from './testUtils/veraidStubs.js';
import { Token } from './Token.js';
import { TokenBundle } from './TokenBundle.js';

const MOCK_TRUST_CHAIN = await MockTrustChain.generate(
  ORG_NAME,
  USER_NAME,
  addMinutes(new Date(), 10),
);

const TOKEN = new Token(AUDIENCE);

describe('TokenBundle', () => {
  describe('sign', () => {
    it('should sign token with specified chain and key', async () => {
      const tokenBundle = await TokenBundle.sign(
        TOKEN,
        MOCK_TRUST_CHAIN.signerPrivateKey,
        MOCK_TRUST_CHAIN.chain,
        addSeconds(new Date(), 10),
      );

      const { member } = await tokenBundle.signatureBundle.verify(
        undefined,
        KLIENTO_SERVICE_OID,
        new Date(),
        MOCK_TRUST_CHAIN.dnssecTrustAnchors,
      );
      expect(member.organisation).toBe(ORG_NAME);
      expect(member.user).toBe(USER_NAME);
    });

    it('should encapsulate specified token', async () => {
      const tokenBundle = await TokenBundle.sign(
        TOKEN,
        MOCK_TRUST_CHAIN.signerPrivateKey,
        MOCK_TRUST_CHAIN.chain,
        addSeconds(new Date(), 10),
      );

      const { plaintext } = await tokenBundle.signatureBundle.verify(
        undefined,
        KLIENTO_SERVICE_OID,
        new Date(),
        MOCK_TRUST_CHAIN.dnssecTrustAnchors,
      );
      const tokenSerialised = Buffer.from(TOKEN.serialise());
      expect(Buffer.from(plaintext).equals(tokenSerialised)).toBeTruthy();
    });

    it('should set specified expiry date', async () => {
      const expiry = setMilliseconds(new Date(), 0);

      const tokenBundle = await TokenBundle.sign(
        TOKEN,
        MOCK_TRUST_CHAIN.signerPrivateKey,
        MOCK_TRUST_CHAIN.chain,
        expiry,
        { startDate: expiry },
      );

      await expect(
        tokenBundle.signatureBundle.verify(
          undefined,
          KLIENTO_SERVICE_OID,
          expiry,
          MOCK_TRUST_CHAIN.dnssecTrustAnchors,
        ),
      ).resolves.toBeDefined();
      await expect(
        tokenBundle.signatureBundle.verify(
          undefined,
          KLIENTO_SERVICE_OID,
          addSeconds(expiry, 1),
          MOCK_TRUST_CHAIN.dnssecTrustAnchors,
        ),
      ).rejects.toThrow();
    });

    it('should set start date to current date by default', async () => {
      const startDate = setMilliseconds(new Date(), 0);

      const tokenBundle = await TokenBundle.sign(
        TOKEN,
        MOCK_TRUST_CHAIN.signerPrivateKey,
        MOCK_TRUST_CHAIN.chain,
        addSeconds(startDate, 10),
      );

      await expect(
        tokenBundle.signatureBundle.verify(
          undefined,
          KLIENTO_SERVICE_OID,
          new Date(),
          MOCK_TRUST_CHAIN.dnssecTrustAnchors,
        ),
      ).resolves.toBeDefined();
      await expect(
        tokenBundle.signatureBundle.verify(
          undefined,
          KLIENTO_SERVICE_OID,
          subSeconds(startDate, 1),
          MOCK_TRUST_CHAIN.dnssecTrustAnchors,
        ),
      ).rejects.toThrow();
    });

    it('should set start date to specified date if provided', async () => {
      const startDate = setMilliseconds(new Date(), 0);

      const tokenBundle = await TokenBundle.sign(
        TOKEN,
        MOCK_TRUST_CHAIN.signerPrivateKey,
        MOCK_TRUST_CHAIN.chain,
        addSeconds(startDate, 10),
        { startDate },
      );

      await expect(
        tokenBundle.signatureBundle.verify(
          undefined,
          KLIENTO_SERVICE_OID,
          startDate,
          MOCK_TRUST_CHAIN.dnssecTrustAnchors,
        ),
      ).resolves.toBeDefined();
      await expect(
        tokenBundle.signatureBundle.verify(
          undefined,
          KLIENTO_SERVICE_OID,
          subSeconds(startDate, 1),
          MOCK_TRUST_CHAIN.dnssecTrustAnchors,
        ),
      ).rejects.toThrow();
    });
  });

  describe('serialise', () => {
    it('should serialise token bundle', async () => {
      const tokenBundle = await TokenBundle.sign(
        TOKEN,
        MOCK_TRUST_CHAIN.signerPrivateKey,
        MOCK_TRUST_CHAIN.chain,
        addSeconds(new Date(), 10),
      );

      const tokenBundleSerialised = tokenBundle.serialise();

      const signatureBundleSerialised = tokenBundle.signatureBundle.serialise();
      expect(
        Buffer.from(tokenBundleSerialised).equals(Buffer.from(signatureBundleSerialised)),
      ).toBeTruthy();
    });
  });
});
