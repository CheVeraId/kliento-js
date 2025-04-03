import { AsnProp, AsnPropTypes } from '@peculiar/asn1-schema';

export class TokenClaimSchema {
  @AsnProp({ type: AsnPropTypes.Utf8String, context: 0, implicit: true })
  public key!: string;

  @AsnProp({ type: AsnPropTypes.Utf8String, context: 1, implicit: true })
  public value!: string;
}
