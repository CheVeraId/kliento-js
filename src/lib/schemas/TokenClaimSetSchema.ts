import { AsnArray, AsnType, AsnTypeTypes } from '@peculiar/asn1-schema';

import { TokenClaimSchema } from './TokenClaimSchema.js';

@AsnType({ itemType: TokenClaimSchema, type: AsnTypeTypes.Set })
export class TokenClaimSetSchema extends AsnArray<TokenClaimSchema> {}
