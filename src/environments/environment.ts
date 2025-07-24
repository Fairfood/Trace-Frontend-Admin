export const clientId = 'MHD2Y3PE4t5YbXSlwq4IdwOK3g8EGQUSXWomgzxw';
export const clientSecret =
  'td1CEhLj871SJuaFUJBksjRpi4o67rIzf7kh1QN2KUimJzVfbW2uibkurY6UacBTKNnlzESkrxN59VAudqRiExQDqOxmVLVSicQTQte3qt4HWSnPI1bceeJzWmcX796S';

const API_URL = 'https://v2.dev.api.fairfood.org/';
export const environment = {
  production: false,
  baseUrl: `${API_URL}v2`,
  ssoBaseUrl: API_URL,
  startYear: 2020,
  gMapKey: 'AIzaSyCqiVSJsDsGqprY4T4VmO44lpK9OF2X5-M',
  googleMapKey: 'AIzaSyBT4Ou4w_n1XpjG4l01nDna5Wimyakt1Wg',
  traceUrl: 'http://localhost:4200',
  authUrl: 'http://localhost:3000',
  totpToken: 'EMRWC3TFNRSXA2DBNZ2HGZLDOJSXI6LPOVXGKZLENZXXOIZD',
  sentryDsn:
    'https://8e3613cb99a24c6995f6833a94ac2a31@o1261458.ingest.sentry.io/4505073547214848',
  sentryEnv: 'local',

  clientId,
  clientSecret,
  authenticateUrl: `http://localhost:3000/sso-authorization?redirect_uri=http://localhost:4300/&client_id=${clientId}&response_type=code&client_secret=${clientSecret}`,
};
