/**
 * VeraId service configuration for Kliento.
 */

const KLIENTO_OID_ARC = '1.3.6.1.4.1.58708.3';

export const KLIENTO_SERVICE_OID = `${KLIENTO_OID_ARC}.0`;

const OCTETS_PER_KIB = 1024;
const MAX_TOKEN_BUNDLE_KILOBYTES = 16;

export const MAX_TOKEN_BUNDLE_OCTETS = MAX_TOKEN_BUNDLE_KILOBYTES * OCTETS_PER_KIB;
