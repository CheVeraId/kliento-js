import { AsnProp, AsnPropTypes } from '@peculiar/asn1-schema';

export class TokenClaimSchema {
  @AsnProp({ context: 0, implicit: true, type: AsnPropTypes.Utf8String })
  public key!: string;

  @AsnProp({ context: 1, implicit: true, type: AsnPropTypes.Utf8String })
  public value!: string;
}
