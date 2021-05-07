import express from 'express';
import { IAppServices } from './app/AppServices';
import { AppConfig } from './config';

export default function appRouteHandlers(app: express.Express, { auction }: IAppServices): void {
  app.use(express.json());
  app.post('/api/auction-schedule', async (req, res) => {
    if (!req.body.key) {
      res.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
    }
    if (req.body.key !== AppConfig.googleCloud.schedulerSecretKey) {
      res.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
    }
    return res.json(auction.scheduleAuctionJob());
  });
}
