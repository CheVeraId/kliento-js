import { type JSONSchema } from 'json-schema-to-ts';

import { compileSchema } from './utilities/ajv.js';

const TOKEN_SCHEMA = {
  properties: {
    audience: { type: 'string' },
    claims: {
      additionalProperties: { type: 'string' },
      propertyNames: { type: 'string' },
      type: 'object',
    },
  },
  required: ['audience'],
  type: 'object',
} as const satisfies JSONSchema;

export const isValidToken = compileSchema(TOKEN_SCHEMA);
