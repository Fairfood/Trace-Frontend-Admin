export const clientId = 'YjPYkVZHf95VkNlG4AUCaleczzk2A6lTTOkYZRdY';
export const clientSecret =
  'w640XBIx4o2dpsaQ1nnBlfMkPIrs01X0GEcQosQvqpbnSyM5a1uIFY3kK6xwh1Kmodm3CCv9tNLmVuAWqlCOj6EEGlfdzU8KVpGGmT787eB27fvSS5NZy4UoVerD21zH';

const API_URL = 'https://v2.api.fairfood.org/';
export const environment = {
  production: true,
  baseUrl: `${API_URL}v2`,
  ssoBaseUrl: API_URL,
  startYear: 2020,
  traceUrl: 'https://trace.fairfood.org/',
  authUrl: 'https://login.fairfood.org',
  // totpToken: 'EMRWC3TFNRSXA2DBNZ2HGZLDOJSXI6LPOVXGKZLENZXXOIZD',
  totpToken: 'QUUV6LBNOAOAGRPQWQQMPGYR2OF5KXG7',
  sentryDsn:
    'https://32f1f1727e7240dfb44cf97ae4fa526f@o1261458.ingest.sentry.io/4505079127408640',
  sentryEnv: 'prod',
  clientId,
  clientSecret,
  authenticateUrl: `https://login.fairfood.org/sso-authorization?redirect_uri=https://admin-trace.fairfood.org/&client_id=${clientId}&response_type=code&client_secret=${clientSecret}`,
  googleMapKey: 'AIzaSyBB3fdkXQMKBlDKY4lXOg2z5Ra0-n5iwlc',
};
