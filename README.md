# kliento-js
Kliento JavaScript Library

## Custom trust anchors

There are only two legitimate reasons to override the DNSSEC trust anchors during verification:

- To test your app locally (e.g., in a CI pipeline, during development).
- To reflect an official change to [the root zone trust anchors](https://www.iana.org/dnssec/files), if you're not able to use a version of this library that uses the new trust anchors.
