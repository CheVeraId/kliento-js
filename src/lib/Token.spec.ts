import { AsnParser } from '@peculiar/asn1-schema';
import { describe, expect, it } from 'vitest';

import { TokenSchema } from './schemas/TokenSchema.js';
import { AUDIENCE, CLAIM_KEY, CLAIM_VALUE } from './testUtils/klientoStubs.js';
import { Token } from './Token.js';

describe('Token', () => {
  describe('serialise', () => {
    it('should include audience', () => {
      const token = new Token(AUDIENCE);

      const tokenSerialised = token.serialise();

      const tokenDeserialised = AsnParser.parse(tokenSerialised, TokenSchema);
      expect(tokenDeserialised.audience).toBe(AUDIENCE);
    });

    it('should omit claims if not provided', () => {
      const token = new Token(AUDIENCE);

      const tokenSerialised = token.serialise();

      const tokenDeserialised = AsnParser.parse(tokenSerialised, TokenSchema);
      expect(tokenDeserialised.claims).toBeUndefined();
    });

    it('should include claims if provided', () => {
      const token = new Token(AUDIENCE, {
        [CLAIM_KEY]: CLAIM_VALUE,
      });

      const tokenSerialised = token.serialise();

      const tokenDeserialised = AsnParser.parse(tokenSerialised, TokenSchema);
      const [claimDeserialised] = tokenDeserialised.claims!;

      expect(claimDeserialised.key).toBe(CLAIM_KEY);
      expect(claimDeserialised.value).toBe(CLAIM_VALUE);
    });

    it('should omit claims if provided empty object', () => {
      const token = new Token(AUDIENCE, {});

      const tokenSerialised = token.serialise();

      const tokenDeserialised = AsnParser.parse(tokenSerialised, TokenSchema);
      expect(tokenDeserialised.claims).toBeUndefined();
    });
  });

  describe('deserialise', () => {
    it('should throw if serialisation is malformed', () => {
      const invalidSerialisation = new ArrayBuffer(1);

      expect(() => Token.deserialise(invalidSerialisation)).toThrowError(
        'Invalid token serialisation',
      );
    });

    it('should output audience', () => {
      const originalToken = new Token(AUDIENCE);
      const serialisation = originalToken.serialise();

      const deserialisedToken = Token.deserialise(serialisation);

      expect(deserialisedToken.audience).toBe(AUDIENCE);
    });

    it('should output claims if present', () => {
      const claims = {
        [CLAIM_KEY]: CLAIM_VALUE,
      };
      const originalToken = new Token(AUDIENCE, claims);
      const serialisation = originalToken.serialise();

      const deserialisedToken = Token.deserialise(serialisation);

      expect(deserialisedToken.claims).toEqual(claims);
    });

    it('should not output claims if absent', () => {
      const originalToken = new Token(AUDIENCE);
      const serialisation = originalToken.serialise();

      const deserialisedToken = Token.deserialise(serialisation);

      expect(deserialisedToken.claims).toBeUndefined();
    });

    it('should not output claims if empty', () => {
      const originalToken = new Token(AUDIENCE, {});
      const serialisation = originalToken.serialise();

      const deserialisedToken = Token.deserialise(serialisation);

      expect(deserialisedToken.claims).toBeUndefined();
    });
  });
});
