const appName = process.env.NEW_RELIC_APP_NAME;
const licenseKey = process.env.NEW_RELIC_LICENSE_KEY;

export const NewrelicConfig =
  appName && licenseKey
    ? {
        appName,
        licenseKey,
      }
    : null;

if (NewrelicConfig) {
  require('newrelic');
}
