import { AsnProp, AsnPropTypes } from '@peculiar/asn1-schema';

import { TokenClaimSchema } from './TokenClaimSchema.js';
import { TokenClaimSetSchema } from './TokenClaimSetSchema.js';

export class TokenSchema {
  @AsnProp({ context: 0, implicit: true, type: AsnPropTypes.Utf8String })
  public audience!: string;

  @AsnProp({ context: 1, implicit: true, optional: true, type: TokenClaimSetSchema })
  public claims?: TokenClaimSchema[];
}
