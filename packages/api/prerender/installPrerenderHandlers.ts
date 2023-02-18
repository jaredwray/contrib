import { Express } from 'express';
import { Connection } from 'mongoose';

import createAppServices from '../app/createAppServices';
import { prerenderAuctionPage } from './prerenderAuctionPage';
import { prerenderInfluencerPage } from './prerenderInfluencerPage';

export function installPrerenderHandlers(app: Express, connection: Connection) {
  const appServices = createAppServices(connection);
  app.use('/profiles/:influencerId', (req, res, next) => prerenderInfluencerPage(appServices, req, res, next));
  app.use('/auctions/:auctionId', (req, res, next) => prerenderAuctionPage(appServices, req, res, next));
}
