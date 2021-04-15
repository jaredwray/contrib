import { graphqlUploadExpress } from 'graphql-upload';
import express from 'express';
import path from 'path';

import { createGraphqlServer } from './graphql';
import { AppLogger } from './logger';
import { initMongodbConnection } from './mongodb';
import { IAppServices } from './app/AppServices';
import createAppServices from './app/createAppServices';
import appRouteHandlers from './routeHandlers';
import { AppConfig } from './config';
import { installPrerenderHandlers } from './prerender';

if (AppConfig.newRelic.enabled) {
  require('newrelic');
}

const app = express();

app.set('view engine', 'pug');

app.use((req, res, next) => {
  console.log(`REQUEST: ${req.url} ${JSON.stringify(req.headers)}`);
  next();
});

(async function () {
  const connection = await initMongodbConnection();
  const appServices: IAppServices = createAppServices(connection);

  if (AppConfig.environment.serveClient) {
    // Production uses a setup when both client and server are served from a single path.
    // note: it is assumed that server is run in prod mode, therefore we use two "..", assuming index.js is is dist folder
    const clientBundlePath = path.join(__dirname, '../client/build');
    AppLogger.info(`serving client from: ${clientBundlePath}`);
    app.use(express.static(clientBundlePath));
    installPrerenderHandlers(app, connection);
    app.get('*', (req, res) => {
      res.sendFile(clientBundlePath + '/index.html', { acceptRanges: false });
    });
  }

  appRouteHandlers(app, appServices);
  app.use('/graphql', graphqlUploadExpress({ maxFiles: 1, maxFileSize: 100000000 }));
  createGraphqlServer(appServices).applyMiddleware({ app });

  app.listen(AppConfig.app.port, () => {
    AppLogger.info(`server is listening on ${AppConfig.app.port}`);
  });
})();
