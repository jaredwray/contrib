import express from 'express';
import bcrypt from 'bcrypt';
import { IAppServices } from './app/AppServices';
import { AppConfig } from './config';

export default function appRouteHandlers(app: express.Express, { auction }: IAppServices): void {
  app.use(express.json());
  app.post('/api/auction-schedule', async (req, res) => {
    if (!req.body.key) {
      res.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
    }
    const isValidKey = await bcrypt.compare(AppConfig.googleCloud.schedulerSecretKey, req.body.key);
    if (!isValidKey) {
      res.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
    }
    return res.json(auction.scheduleAuctionJob());
  });
}
