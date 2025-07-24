export const clientId = 'MHD2Y3PE4t5YbXSlwq4IdwOK3g8EGQUSXWomgzxw';
export const clientSecret =
  'td1CEhLj871SJuaFUJBksjRpi4o67rIzf7kh1QN2KUimJzVfbW2uibkurY6UacBTKNnlzESkrxN59VAudqRiExQDqOxmVLVSicQTQte3qt4HWSnPI1bceeJzWmcX796S';

const API_URL = 'https://v2.dev.api.fairfood.org/';
export const environment = {
  production: true,
  baseUrl: `${API_URL}v2`,
  ssoBaseUrl: API_URL,
  startYear: 2020,
  googleMapKey: 'AIzaSyBF5G1enBrsJunVwtqYJGAMcTs064LaIfE',
  traceUrl: 'https://trace-dev.fairfood.nl/',
  authUrl: 'https://login-dev.fairfood.org',
  totpToken: 'EMRWC3TFNRSXA2DBNZ2HGZLDOJSXI6LPOVXGKZLENZXXOIZD',
  sentryDsn:
    'https://8e3613cb99a24c6995f6833a94ac2a31@o1261458.ingest.sentry.io/4505073547214848',
  sentryEnv: 'dev',

  clientId,
  clientSecret,
  authenticateUrl: `https://login-dev.fairfood.org/sso-authorization?redirect_uri=https://admin-dev.fairfood.nl/&client_id=${clientId}&response_type=code&client_secret=${clientSecret}`,
};
