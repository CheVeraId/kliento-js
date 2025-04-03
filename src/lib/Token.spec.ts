import { describe, expect, it } from 'vitest';

import { AsnParser } from '@peculiar/asn1-schema';

import { Token } from './Token.js';
import { TokenSchema } from './schemas/TokenSchema.js';

const STUB_AUDIENCE = 'test';
const STUB_CLAIM_KEY = 'claim_key';
const STUB_CLAIM_VALUE = 'claim_value';

describe('Token', () => {
  describe('serialise', () => {
    it('should include audience', () => {
      const token = new Token(STUB_AUDIENCE);

      const tokenSerialised = token.serialise();

      const tokenDeserialised = AsnParser.parse(tokenSerialised, TokenSchema);
      expect(tokenDeserialised.audience).toBe(STUB_AUDIENCE);
    });

    it('should omit claims if not provided', () => {
      const token = new Token(STUB_AUDIENCE);

      const tokenSerialised = token.serialise();

      const tokenDeserialised = AsnParser.parse(tokenSerialised, TokenSchema);
      expect(tokenDeserialised.claims).toBeUndefined();
    });

    it('should include claims if provided', () => {
      const token = new Token(STUB_AUDIENCE, { [STUB_CLAIM_KEY]: STUB_CLAIM_VALUE });

      const tokenSerialised = token.serialise();

      const tokenDeserialised = AsnParser.parse(tokenSerialised, TokenSchema);
      expect(tokenDeserialised.claims).toHaveLength(1);
      const claimDeserialised = tokenDeserialised.claims![0];
      expect(claimDeserialised.key).toBe(STUB_CLAIM_KEY);
      expect(claimDeserialised.value).toBe(STUB_CLAIM_VALUE);
    });

    it('should omit claims if provided empty object', () => {
      const token = new Token(STUB_AUDIENCE, {});

      const tokenSerialised = token.serialise();

      const tokenDeserialised = AsnParser.parse(tokenSerialised, TokenSchema);
      expect(tokenDeserialised.claims).toBeUndefined();
    });
  });

  describe('deserialise', () => {
    it('should throw if serialisation is malformed', () => {
      const invalidSerialisation = new ArrayBuffer(8);

      expect(() => Token.deserialise(invalidSerialisation)).toThrowError(
        'Invalid token serialisation',
      );
    });

    it('should output audience', () => {
      const originalToken = new Token(STUB_AUDIENCE);
      const serialisation = originalToken.serialise();

      const deserialisedToken = Token.deserialise(serialisation);

      expect(deserialisedToken.audience).toBe(STUB_AUDIENCE);
    });

    it('should output claims if present', () => {
      const claims = { [STUB_CLAIM_KEY]: STUB_CLAIM_VALUE };
      const originalToken = new Token(STUB_AUDIENCE, claims);
      const serialisation = originalToken.serialise();

      const deserialisedToken = Token.deserialise(serialisation);

      expect(deserialisedToken.claims).toEqual(claims);
    });

    it('should not output claims if absent', () => {
      const originalToken = new Token(STUB_AUDIENCE);
      const serialisation = originalToken.serialise();

      const deserialisedToken = Token.deserialise(serialisation);

      expect(deserialisedToken.claims).toBeUndefined();
    });

    it('should not output claims if empty', () => {
      const originalToken = new Token(STUB_AUDIENCE, {});
      const serialisation = originalToken.serialise();

      const deserialisedToken = Token.deserialise(serialisation);

      expect(deserialisedToken.claims).toBeUndefined();
    });
  });
});
