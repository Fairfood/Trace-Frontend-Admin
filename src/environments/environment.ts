// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'https://v2.dev.api.fairfood.org/v2',
  startYear: 2020,
  gMapKey: 'AIzaSyCqiVSJsDsGqprY4T4VmO44lpK9OF2X5-M',
  traceUrl: 'http://localhost:4200',
  authUrl: 'http://localhost:3000',
  totpToken: 'EMRWC3TFNRSXA2DBNZ2HGZLDOJSXI6LPOVXGKZLENZXXOIZD',
  sentryDsn:
    'https://8e3613cb99a24c6995f6833a94ac2a31@o1261458.ingest.sentry.io/4505073547214848',
  sentryEnv: 'local',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
