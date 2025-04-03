import { AsnArray, AsnType, AsnTypeTypes } from '@peculiar/asn1-schema';
import { TokenClaimSchema } from './TokenClaimSchema.js';

@AsnType({ type: AsnTypeTypes.Set, itemType: TokenClaimSchema })
export class TokenClaimSetSchema extends AsnArray<TokenClaimSchema> {}
