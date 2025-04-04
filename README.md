# Kliento JavaScript Library

This is the JavaScript implementation of [VeraId](https://veraid.net/) Kliento, a client authentication protocol where tokens contain all the data required to be verified without pre-distributing public keys or accessing remote servers. Think JWTs, without JWKS documents to pre-distribute or download in real-time.

Each token is distributed as part of a _token bundle_, which is a binary blob that contains the token itself along with the VeraId chain of trust. To authenticate, the client has to share its token bundle with the server.

## Installation

The latest version can be installed from NPM:

```shell
npm install kliento
```

## Usage

### Verify token bundles

To verify a token bundle, the server simply has to use the [`TokenBundle.verify()` method](https://docs.veraid.net/kliento-js/classes/TokenBundle.html#verify).

For example, if the bundle is present in an `Authorization` request header, the server could verify it as follows:

```typescript
import { AuthHeaderValue, TokenBundle, type TokenBundleVerification } from 'kliento';

const AUDIENCE = 'https://api.example.com';

async function verifyTokenBundle(authHeaderValue: string): Promise<TokenBundleVerification> {
    const { tokenBundle } = AuthHeaderValue.parse(authHeaderValue);
    return tokenBundle.verify(AUDIENCE);
}
```

As long as the `Authorization` header and its encapsulated Kliento token bundle are valid, verification will succeed and `verifyTokenBundle()` will output:

- `subject`: The VeraId [`Member`](https://docs.relaycorp.tech/veraid-js/interfaces/Member.html) to whom the token bundle is attributed (e.g. `example.com`, `alice@example.com`).
- `claims`: The [claims](https://docs.veraid.net/kliento-js/interfaces/ClaimSet.html) in the token. This is an optional key/value map analogous to JWT claims. It's up to the server to define what claims are present and what they mean.

### Obtain token bundles

Clients will typically obtain token bundles in the form of _organisation signatures_ from [VeraId Authority](https://docs.relaycorp.tech/veraid-authority/).

Once they obtain a token bundle, they can use [AuthHeaderValue](https://docs.veraid.net/kliento-js/classes/AuthHeaderValue.html) to encode it as an `Authorization` header value. For example:

```typescript
import { AuthHeaderValue } from 'kliento';

function encodeTokenBundle(tokenBundle: TokenBundle): string {
    const authHeaderValue = new AuthHeaderValue(tokenBundle);
    return authHeaderValue.toString();
}
```

## Custom trust anchors

This library allows for custom DNSSEC trust anchors to be used during verification, but there are only two legitimate reasons to override this:

- To test your app locally (e.g., in a CI pipeline, during development).
- To reflect an official change to [the root zone trust anchors](https://www.iana.org/dnssec/files), if you're not able to use a version of this library that uses the new trust anchors.

## API docs

The API documentation can be found on [docs.veraid.net](https://docs.veraid.net/kliento-js/).

## Contributions

We love contributions! If you haven't contributed to a Relaycorp project before, please take a minute to [read our guidelines](https://github.com/relaycorp/.github/blob/master/CONTRIBUTING.md) first.
