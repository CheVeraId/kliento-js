import { AsnPropTypes, AsnProp as prop } from '@peculiar/asn1-schema';

import { TokenClaimSchema } from './TokenClaimSchema.js';
import { TokenClaimSetSchema } from './TokenClaimSetSchema.js';

export class TokenSchema {
  @prop({ context: 0, implicit: true, type: AsnPropTypes.Utf8String })
  public audience!: string;

  @prop({ context: 1, implicit: true, optional: true, type: TokenClaimSetSchema })
  public claims?: TokenClaimSchema[];
}
