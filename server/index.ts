import { config as loadDotEnvFile } from 'dotenv';
import * as fs from 'fs-extra';

if (fs.pathExistsSync(`./.env`)) {
  loadDotEnvFile();
}

import { AppConfig } from './config';

if (AppConfig.newRelic.enabled) {
  require('newrelic');
}

import * as express from 'express';
import * as path from 'path';
import { createGraphqlServer } from './graphql';
import { AppLogger } from './logger';
import { initMongodbConnection } from './mongodb';
import { IAppServices } from './app/AppServices';
import createAppServices from './app/createAppServices';
import appRouteHandlers from './routeHandlers';

const app = express();

if (AppConfig.environment.serveClient) {
  // Production uses a setup when both client and server are served from a single path.
  // note: it is assumed that server is run in prod mode, therefore we use two "..", assuming index.js is is dist folder
  const clientBundlePath = path.join(__dirname, '../../client/build');
  AppLogger.info(`serving client from: ${clientBundlePath}`);
  app.use(express.static(clientBundlePath));
  app.get('*', (req, res) => {
    res.sendFile(clientBundlePath + '/index.html', { acceptRanges: false });
  });
}

(async function () {
  const connection = await initMongodbConnection();
  const appServices: IAppServices = createAppServices(connection);

  appRouteHandlers(app, appServices);
  createGraphqlServer(appServices).applyMiddleware({ app });

  app.listen(AppConfig.app.port, () => {
    AppLogger.info(`server is listening on ${AppConfig.app.port}`);
  });
})();
