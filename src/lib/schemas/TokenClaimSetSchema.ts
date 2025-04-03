import { AsnArray, AsnTypeTypes, AsnType as type } from '@peculiar/asn1-schema';

import { TokenClaimSchema } from './TokenClaimSchema.js';

@type({ itemType: TokenClaimSchema, type: AsnTypeTypes.Set })
export class TokenClaimSetSchema extends AsnArray<TokenClaimSchema> {}
