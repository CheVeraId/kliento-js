import { describe, expect, it } from 'vitest';

import { AUDIENCE, CLAIM_KEY, CLAIM_VALUE } from './testUtils/klientoStubs.js';
import { Token } from './Token.js';

function jsonParse(serialisation: ArrayBuffer): unknown {
  const string = new TextDecoder().decode(serialisation);

  return JSON.parse(string);
}

describe('Token', () => {
  describe('serialise', () => {
    it('should include audience', () => {
      const token = new Token(AUDIENCE);

      const tokenSerialised = token.serialise();

      const tokenDeserialised = jsonParse(tokenSerialised);
      expect(tokenDeserialised).toHaveProperty('audience', AUDIENCE);
    });

    it('should omit claims if not provided', () => {
      const token = new Token(AUDIENCE);

      const tokenSerialised = token.serialise();

      const tokenDeserialised = jsonParse(tokenSerialised);
      expect(tokenDeserialised).not.toHaveProperty('claims');
    });

    it('should include claims if provided', () => {
      const token = new Token(AUDIENCE, {
        [CLAIM_KEY]: CLAIM_VALUE,
      });

      const tokenSerialised = token.serialise();

      const tokenDeserialised = jsonParse(tokenSerialised);
      expect(tokenDeserialised).toHaveProperty('claims', {
        [CLAIM_KEY]: CLAIM_VALUE,
      });
    });

    it('should omit claims if provided empty object', () => {
      const token = new Token(AUDIENCE, {});

      const tokenSerialised = token.serialise();

      const tokenDeserialised = jsonParse(tokenSerialised);
      expect(tokenDeserialised).not.toHaveProperty('claims');
    });
  });

  describe('deserialise', () => {
    const encoder = new TextEncoder();

    it('should throw if serialisation is malformed JSON', () => {
      const invalidSerialisation = encoder.encode('malformed');

      expect(() => Token.deserialise(invalidSerialisation)).toThrowError('Malformed JSON value');
    });

    it('should throw if serialisation is invalid', () => {
      const invalidSerialisation = encoder.encode('{"claims": {}}');

      expect(() => Token.deserialise(invalidSerialisation)).toThrowError(
        'Invalid token serialisation',
      );
    });

    it('should output audience', () => {
      const originalToken = new Token(AUDIENCE, {});
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

    it('should output empty claims if absent', () => {
      const tokenDoc = {
        audience: AUDIENCE,
      };
      const serialisation = encoder.encode(JSON.stringify(tokenDoc));

      const deserialisedToken = Token.deserialise(serialisation);

      expect(deserialisedToken.claims).toEqual({});
    });

    it('should output claims if empty', () => {
      const tokenDoc = {
        audience: AUDIENCE,
        claims: {},
      };
      const serialisation = encoder.encode(JSON.stringify(tokenDoc));

      const deserialisedToken = Token.deserialise(serialisation);

      expect(deserialisedToken.claims).toEqual({});
    });
  });
});
