import { config as loadDotEnvFile } from 'dotenv';
if (process.env.NODE_ENV === 'local') {
  loadDotEnvFile();
}

import { AppConfig } from './config';
if (AppConfig.newRelic.enabled) {
  require('newrelic');
}

import { createGraphqlServer } from './graphql';
import { AppLogger } from './logger';

createGraphqlServer()
  .listen(AppConfig.app.port)
  .then(
    ({ url }) => {
      AppLogger.info(`server is listening on ${url}`);
    },
    (error) => {
      AppLogger.error(`error starting server on port ${AppConfig.app.port}:`, error);
    },
  );
