import express from 'express';
import bodyParser from 'body-parser';
import { IAppServices } from './app/AppServices';
import { AppConfig } from './config';
import { StripeCharityStatus } from './app/Charity/dto/StripeCharityStatus';
import { CharityProfileStatus } from './app/Charity/dto/CharityProfileStatus';

export default function appRouteHandlers(app: express.Express, { auction, charity, stripe }: IAppServices): void {
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

  app.get('/api/v1/account_onboarding', async (req: express.Request, res: express.Response) => {
    const { user_id: userId } = req.query;
    if (!userId || typeof userId !== 'string') {
      res.redirect(AppConfig.app.url);
      return;
    }
    const currentCharity = await charity.findCharity(userId);
    if (currentCharity?.profileStatus != CharityProfileStatus.PENDING_ONBOARDING) {
      res.redirect(AppConfig.app.url);
      return;
    }
    await charity.updateCharityStatus(currentCharity, null, StripeCharityStatus.PENDING_VERIFICATION);
    res.redirect(AppConfig.app.url);
  });

  app.post('/api/v1/stripe/', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];
    const event = stripe.constructEvent(request.body, sig as string);

    if (event.type === 'account.updated') {
      await charity.updateCharityByStripeAccount(event.data.object);
    }
    response.sendStatus(200);
  });
}
