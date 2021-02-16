import { config as loadDotEnvFile } from 'dotenv';
import * as fs from "fs-extra";

if (fs.pathExistsSync(`./.env`)) {
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

if (AppConfig.environment.serveClient) {
  // Production uses a setup when both client and server are served from a single path.
  // note: it is assumed that server is run in prod mode, therefore we use two "..", assuming index.js is is dist folder
  const clientBundlePath = path.join(__dirname, '../../client/build');
  AppLogger.info(`serving client from: ${clientBundlePath}`);
  app.use(express.static(clientBundlePath));
  app.get("*", (req, res) => {
      res.sendFile(clientBundlePath + "/index.html", { acceptRanges: false });
    });
}
createGraphqlServer().applyMiddleware({ app });

app.listen(AppConfig.app.port, () => {
  AppLogger.info(`server is listening on ${AppConfig.app.port}`);
});
