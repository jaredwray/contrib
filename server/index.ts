import { graphqlUploadExpress } from 'graphql-upload';
import express from 'express';
import path from 'path';
import passport from 'passport';
import cors from 'cors';
import cookieSession from 'cookie-session';
import { createServer } from 'http';

import { createGraphqlServer } from './graphql';
import { AppLogger } from './logger';
import { initMongodbConnection } from './mongodb';
import { IAppServices } from './app/AppServices';
import createAppServices from './app/createAppServices';
import { createPassportStrategies } from './auth/passportjs';
import appRouteHandlers from './routeHandlers';
import { AppConfig } from './config';
import { installPrerenderHandlers } from './prerender';

if (AppConfig.newRelic.enabled) require('newrelic');

const app = express();
const httpServer = createServer(app);

app.set('view engine', 'pug');

(async function () {
  const connection = await initMongodbConnection();
  const appServices: IAppServices = createAppServices(connection);
  const corsOptions = {
    origin: [AppConfig.app.url],
    credentials: true,
  };
  const bytesInGB = Math.pow(1024, 3);

  app.use(cors(corsOptions));
  app.use(
    cookieSession({
      name: 'auth cookies',
      maxAge: Number(AppConfig.auth.cookies.cookiesLiveTime) * 60 * 1000, //24 hours in milliseconds
      keys: [AppConfig.auth.cookies.cookiesSecret],
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  createPassportStrategies(appServices.twilioVerification);

  appRouteHandlers(app, appServices);

  if (AppConfig.environment.serveClient) {
    // Production uses a setup when both client and server are served from a single path.
    // note: it is assumed that server is run in prod mode, therefore we use two "..", assuming index.js is is dist folder
    const clientBundlePath = path.join(__dirname, '../../client/build');
    AppLogger.info(`serving client from: ${clientBundlePath}`);
    app.use(express.static(clientBundlePath));
    installPrerenderHandlers(app, connection);
    app.get('*', (req, res) => {
      res.sendFile(clientBundlePath + '/index.html', { acceptRanges: false });
    });
  }

  app.use(express.json({ limit: '500mb' }));
  app.use(
    express.urlencoded({
      limit: '500mb',
      parameterLimit: 100000,
      extended: true,
    }),
  );
  app.use(
    '/graphql',
    graphqlUploadExpress({
      maxFiles: 1,
      maxFileSize: parseFloat(AppConfig.cloudflare.maxSizeGB) * bytesInGB || Infinity,
    }),
  );

  createGraphqlServer(appServices, httpServer).applyMiddleware({ app, cors: corsOptions });

  httpServer.listen(AppConfig.app.port, async () => {
    AppLogger.info(`server is listening on ${AppConfig.app.port}`);
  });
})();
