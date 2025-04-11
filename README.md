# Kliento JavaScript Library

This is the JavaScript implementation of Kliento, a **client authentication protocol** where tokens contain all the data required to be verified offline without pre-distributing public keys or accessing remote servers. Think JWTs, without JWKS documents to pre-distribute or download during verification.

Kliento is a very simple protocol based on [VeraId](https://veraid.net/). Each token is distributed as part of a _token bundle_, which is a binary blob that contains the token itself along with the VeraId chain of trust.

Simply put, Kliento extends the idea of AWS roles, Azure managed identities, GCP service accounts and Kubernetes service accounts to the entire Internet in a vendor-neutral manner.

## Installation

This library is available on NPM as [`@veraid/kliento`](https://www.npmjs.com/package/@veraid/kliento).

## Usage

### Server-side verification

To verify a token bundle, the server simply has to use the [`TokenBundle.verify()` method](https://docs.veraid.net/kliento-js/classes/TokenBundle.html#verify).

For example, in an HTTP server, the bundle can be passed Base64-encoded in an `Authorization` request header with the `Kliento` scheme (i.e. `Authorization: Kliento <base64-encoded-bundle>`), and the server could verify it as follows:

```typescript
import { TokenBundle, type TokenBundleVerification } from '@veraid/kliento';

// Replace with a unique identifier for your server
const AUDIENCE = 'https://api.example.com';

async function verifyTokenBundle(authHeaderValue: string): Promise<TokenBundleVerification> {
    const tokenBundle = TokenBundle.deserialiseFromAuthHeader(authHeaderValue);
    return await tokenBundle.verify(AUDIENCE);
}
```

Alternatively, if the bundle is already available as an `ArrayBuffer` or `Buffer`, it should be deserialised with the [`TokenBundle.deserialise()` method](https://docs.veraid.net/kliento-js/classes/TokenBundle.html#deserialise) instead.

As long as the Kliento token bundle is valid and bound to the specified audience, `TokenBundle.verify()` will output:

- `subject`: The VeraId [`Member`](https://docs.relaycorp.tech/veraid-js/interfaces/Member.html) to whom the token bundle is attributed (e.g. `example.com`, `alice` of `example.com`).
- `claims`: The [claims](https://docs.veraid.net/kliento-js/types/ClaimSet.html) in the token. This is an optional key/value map analogous to JWT claims. It's up to the server to define what claims are present and what they mean.

If the deserialisation input is malformed, `deserialiseFromAuthHeader()` and `deserialise()` will throw an error. Similarly, if the token is invalid or bound to a different audience, `verify()` will throw an error.

### Client-side token acquisition

To obtain token bundles, clients must first register the _signature specification_ for such bundles in [VeraId Authority](https://docs.relaycorp.tech/veraid-authority/). The payload of the signature specification must be set to a Kliento token, which is a JSON document with the following properties:

- `audience` (`string`, required): The audience for which the token is valid.
- `claims` (`object`, optional): A map of key/value pairs, where keys and values are strings.

For example:

```json
{
  "audience": "https://api.example.com",
  "claims": { "permission": "read-only" }
}
```

Once the signature specification is registered, clients can obtain token bundles for that specification by making a simple HTTP request to VeraId Authority. No Kliento or VeraId libraries are required at runtime, but clients may use a high-level library to simplify the process, such as [`@veraid/authority-credentials`](https://github.com/CheVeraId/authority-credentials-js) for JS.

For example, to send a token bundle to an HTTP server in the `Authorization` request header, the client could use the following code to encode the header value:

```typescript
function encodeAuthHeaderValue(tokenBundle: Buffer): string {
    const bundleEncoded = tokenBundle.toString('base64');
    return `Kliento ${bundleEncoded}`;
}
```

## Custom trust anchors

`TokenBundle.verify()` allows for custom DNSSEC trust anchors to be passed, but there are only two legitimate reasons to do this:

- To test token bundle verification in unit or integration tests.
- To reflect an official change to [the root zone trust anchors](https://www.iana.org/dnssec/files), if you're not able to use a version of this library that uses the new trust anchors.

## API docs

The API documentation can be found on [docs.veraid.net](https://docs.veraid.net/kliento-js/).

## Contributions

We love contributions! If you haven't contributed to a Relaycorp project before, please take a minute to [read our guidelines](https://github.com/relaycorp/.github/blob/master/CONTRIBUTING.md) first.

Issues are tracked on the [`KLIB` project on Jira](https://relaycorp.atlassian.net/browse/KLIB).
