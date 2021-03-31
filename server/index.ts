import { config as loadDotEnvFile } from 'dotenv';
import fs from 'fs-extra';
import { graphqlUploadExpress } from 'graphql-upload';

if (fs.pathExistsSync(`./.env`)) {
  loadDotEnvFile();
}

import { AppConfig } from './config';

if (AppConfig.newRelic.enabled) {
  require('newrelic');
}

import express from 'express';
import prerender from 'prerender-node';
import path from 'path';
import { createGraphqlServer } from './graphql';
import { AppLogger } from './logger';
import { initMongodbConnection } from './mongodb';
import { IAppServices } from './app/AppServices';
import createAppServices from './app/createAppServices';
import appRouteHandlers from './routeHandlers';

const app = express();
app.use((req, res, next) => {
  console.log(`REQUEST: ${req.url} ${JSON.stringify(req.headers)}`);
  next();
})

app.use(prerender
  // .whitelisted('^/auctions/.*')
  .set('prerenderServiceUrl', 'http://localhost:3000')
  .set('prerenderToken', 'rXlesgnFdcYbI2HlT4fd')
)
if (AppConfig.environment.serveClient) {
  // Production uses a setup when both client and server are served from a single path.
  // note: it is assumed that server is run in prod mode, therefore we use two "..", assuming index.js is is dist folder
  const clientBundlePath = path.join(__dirname, '../client/build');
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
  app.use(prerender
    // .whitelisted('^/auctions/.*')
    .set('prerenderServiceUrl', 'http://localhost:3000')
    .set('prerenderToken', 'rXlesgnFdcYbI2HlT4fd')
  )
  app.use('/graphql', graphqlUploadExpress({ maxFiles: 1, maxFileSize: 100000000 }));
  createGraphqlServer(appServices).applyMiddleware({ app });

  app.listen(AppConfig.app.port, () => {
    AppLogger.info(`server is listening on ${AppConfig.app.port}`);
  });
})();
