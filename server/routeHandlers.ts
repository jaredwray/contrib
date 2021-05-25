import express from 'express';
import bodyParser from 'body-parser';
import { IAppServices } from './app/AppServices';
import { AppConfig } from './config';
import { CharityStatus } from './app/Charity/dto/CharityStatus';
import { CharityStripeStatus } from './app/Charity/dto/CharityStripeStatus';
import { AppLogger } from './logger';

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
    const redirectToUrl = `${AppConfig.app.url}/charity/me/edit`;

    if (currentCharity?.status !== CharityStatus.PENDING_ONBOARDING) {
      res.redirect(redirectToUrl);
      return;
    }

    await charity.updateCharityStatus({
      charity: currentCharity,
      stripeStatus: CharityStripeStatus.PENDING_VERIFICATION,
    });

    res.redirect(redirectToUrl);
  });

  app.post('/api/v1/stripe/', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];
    AppLogger.info(`Stripe sign: ${sig}`);
    if (!sig) {
      response.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
    }
    let event;
    try {
      event = stripe.constructEvent(request.body, sig as string);
    } catch (err) {
      AppLogger.error(`Error constructing event: ${err.message}`);
      response.status(400).send(`Webhook Error: ${err.message}`);
    }
    AppLogger.info(`Stripe sign: ${event}`);

    if (event.type === 'account.updated') {
      await charity.updateCharityByStripeAccount(event.data.object);
    }

    response.sendStatus(200);
  });
}
