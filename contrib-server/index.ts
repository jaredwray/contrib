import { config as loadDotEnvFile } from 'dotenv';

if (process.env.NODE_ENV === 'local') {
  loadDotEnvFile();
}

import { AppConfig } from './config';

if (AppConfig.newRelic.enabled) {
  require('newrelic');
}

import * as express from 'express';
import { createGraphqlServer } from './graphql';
import { AppLogger } from './logger';
import * as path from 'path';

const app = express();

if (AppConfig.environment.isProduction) {
  // Production uses a setup when both client and server are served from a single path.
  // note: it is assumed that server is run in prod mode, therefore we use two "..", assuming index.js is is dist folder
  const clientBundlePath = path.join(__dirname, '../../client/build');
  app.use(express.static(clientBundlePath));
}
createGraphqlServer().applyMiddleware({ app });

app.listen(AppConfig.app.port, () => {
  AppLogger.info(`server is listening on ${AppConfig.app.port}`);
});
