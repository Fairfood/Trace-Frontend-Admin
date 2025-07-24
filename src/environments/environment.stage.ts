export const clientId = 'Jd0mGNrP2ZwAPsp48QByCQpjTiXSQ9f5Xpuz5r2D';
export const clientSecret =
  'KQL4rfWoadtmmUHygKWMM3er23FhDa5FqINrA2Oq2fErnNbZHK30Xa7gWJMAHRa0m7JxpnM83fXL3wLJlDGY9OEnaM3lMrijGfLMHqJlwTMQqHHtgYd5feWGr47tcHPL';

const API_URL = 'https://v2.staging.api.fairfood.org/';
export const environment = {
  production: true,
  baseUrl: `${API_URL}v2`,
  ssoBaseUrl: API_URL,
  startYear: 2020,
  traceUrl: 'https://trace-stage.fairfood.nl/',
  authUrl: 'https://login-stage.fairfood.org',
  totpToken: 'EMRWC3TFNRSXA2DBNZ2HGZLDOJSXI6LPOVXGKZLENZXXOIZD',
  sentryDsn:
    'https://8e3613cb99a24c6995f6833a94ac2a31@o1261458.ingest.sentry.io/4505073547214848',
  sentryEnv: 'stage',
  clientId,
  clientSecret,
  authenticateUrl: `https://login-stage.fairfood.org/sso-authorization?redirect_uri=https://admin-stage.fairfood.nl/&client_id=${clientId}&response_type=code&client_secret=${clientSecret}`,
  googleMapKey: 'AIzaSyBF5G1enBrsJunVwtqYJGAMcTs064LaIfE',
};
