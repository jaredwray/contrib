import express from 'express';
import { IAppServices } from './app/AppServices';
import { AppConfig } from './config';
import { CharityStatus } from './app/Charity/dto/CharityStatus';
import { CharityStripeStatus } from './app/Charity/dto/CharityStripeStatus';
import { AppLogger } from './logger';

export default function appRouteHandlers(app: express.Express, { auction, charity, stripe }: IAppServices): void {
  app.use((req, res, next) => {
    if (req.originalUrl === '/api/v1/stripe/') {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  app.post('/api/auction-schedule', async (req, res) => {
    AppLogger.info(`----/api/auction-schedule/----start-`);

    AppLogger.info(`req.body: ${req.body}`);
    AppLogger.info(`req.body.key: ${req.body.key}`);
    if (!req.body.key) {
      res.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
    }

    AppLogger.info(`AppConfig.googleCloud.schedulerSecretKey: ${AppConfig.googleCloud.schedulerSecretKey}`);
    if (req.body.key !== AppConfig.googleCloud.schedulerSecretKey) {
      res.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
    }
    AppLogger.info(`----/api/auction-schedule/----end-`);
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

  app.post('/api/v1/stripe/', express.raw({ type: 'application/json' }), async (request, response) => {
    AppLogger.info(`----/api/v1/stripe/----start-`);
    AppLogger.info(`Stripe request body: ${request.body}`);

    const sig = request.headers['stripe-signature'];
    AppLogger.info(`Stripe sign: ${sig}`);

    if (!sig) {
      AppLogger.error(`UNAUTHORIZED event`);
      response.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
    }

    let event;
    try {
      event = stripe.constructEvent(request.body, sig as string);
    } catch (err) {
      AppLogger.error(`Error constructing event: ${err.message}`);
      response.sendStatus(400).json({ message: err.message });
      return;
    }

    AppLogger.info(`Event: ${event}`);
    AppLogger.info(`event.id: ${event.id}`);
    AppLogger.info(`event.type: ${event.type}`);

    if (event.type === 'account.updated') {
      AppLogger.info(`Account updating`);
      try {
        await charity.updateCharityByStripeAccount(event.data.object);
      } catch (err) {
        AppLogger.error(`Charity update error: ${err.message}`);
        response.sendStatus(400).json({ message: err.message });
        return;
      }
    }

    AppLogger.info(`----/api/v1/stripe/----end-`);
    response.sendStatus(200);
  });
}
