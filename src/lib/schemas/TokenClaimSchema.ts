import { AsnPropTypes, AsnProp as prop } from '@peculiar/asn1-schema';

export class TokenClaimSchema {
  @prop({ context: 0, implicit: true, type: AsnPropTypes.Utf8String })
  public key!: string;

  @prop({ context: 1, implicit: true, type: AsnPropTypes.Utf8String })
  public value!: string;
}
