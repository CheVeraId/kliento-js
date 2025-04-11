import { Ajv } from 'ajv';
import { type $Compiler, wrapCompilerAsTypeGuard } from 'json-schema-to-ts';

const ajv = new Ajv();
const $compile: $Compiler = (schema) => ajv.compile(schema);

export const compileSchema = wrapCompilerAsTypeGuard($compile);
