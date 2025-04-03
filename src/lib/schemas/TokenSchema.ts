import { AsnProp, AsnPropTypes } from '@peculiar/asn1-schema';
import { TokenClaimSchema } from './TokenClaimSchema.js';
import { TokenClaimSetSchema } from './TokenClaimSetSchema.js';

export class TokenSchema {
  @AsnProp({ type: AsnPropTypes.Utf8String, context: 0, implicit: true })
  public audience!: string;

  @AsnProp({ type: TokenClaimSetSchema, context: 1, implicit: true, optional: true })
  public claims?: TokenClaimSchema[];
}
