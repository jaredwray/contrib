import express from 'express';
import bodyParser from 'body-parser';
import { IAppServices } from './app/AppServices';
import { AppConfig } from './config';
import { CharityStatus } from './app/Charity/dto/CharityStatus';
import { CharityStripeStatus } from './app/Charity/dto/CharityStripeStatus';
import { isAuthorizedRequest } from './helpers/isAuthorizedRequest';
import { AppLogger } from 'logger';
export default function appRouteHandlers(
  app: express.Express,
  { auction, charity, stripeService, twilioNotification }: IAppServices,
): void {
  app.use((req, res, next) => {
    if (['/api/v1/stripe/'].includes(req.originalUrl)) {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  app.post('/api/v1/relocate-bids-in-bid-collection', async (req, res) => {
    if (!isAuthorizedRequest(req, res)) {
      return;
    }

    const response = await auction.relocateAuctionBidsInBidCollection();
    return res.json(response);
  });

  app.post('/api/v1/relocate-bids-in-auction-collection', async (req, res) => {
    if (!isAuthorizedRequest(req, res)) {
      return;
    }

    const response = await auction.relocateBidsFromBidsModelInAuctions();
    return res.json(response);
  });

  app.post('/api/v1/auctions-settle', async (req, res) => {
    if (!isAuthorizedRequest(req, res)) {
      return;
    }

    const response = await auction.scheduleAuctionJobSettle();
    return res.json(response);
  });

  app.post('/api/v1/auctions-start', async (req, res) => {
    if (!isAuthorizedRequest(req, res)) {
      return;
    }

    const response = await auction.scheduleAuctionJobStart();
    return res.json(response);
  });

  app.post('/api/v1/auctions-ends-notify', async (req, res) => {
    if (!isAuthorizedRequest(req, res)) {
      return;
    }

    const response = await auction.scheduleAuctionEndsNotification();
    return res.json(response);
  });

  app.post('/api/v1/auctions-metrics', async (req, res) => {
    if (!isAuthorizedRequest(req, res)) {
      return;
    }

    const response = await auction.scheduleAuctionMetrics();
    return res.json(response);
  });

  app.post('/api/v1/notification', bodyParser.raw({ type: 'application/octet-stream' }), async (req, res) => {
    const parsedBody = JSON.parse(req.body);

    if (!parsedBody) {
      res.sendStatus(400).json({ message: 'BAD REQUEST' });
    }

    if (parsedBody.api_token !== AppConfig.googleCloud.task.googleTaskApiToken) {
      res.sendStatus(401).json({ message: 'UNAUTHORIZED' });
    }

    await twilioNotification.sendMessage(parsedBody.phoneNumber, parsedBody.message);
    res.sendStatus(200);
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
    const sig = request.headers['stripe-signature'];

    if (!sig) {
      response.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
    }

    let event;
    try {
      event = stripeService.constructEvent(request.body, sig as string);
    } catch (err) {
      AppLogger.error(`Cannot handle stripe event with ${event.type} type: ${err.message}`);
      response.sendStatus(400).json({ message: err.message });
      return;
    }

    const object = event.data.object;

    AppLogger.info(
      `New stripe event for charity received. Stripe account id: ${object.id}. Event type: ${event.type},`,
    );
    if (event.type === 'account.updated') {
      try {
        await charity.updateCharityByStripeAccount(object);
      } catch (err) {
        AppLogger.warn(`Cannot update charity by stripe account #${object.id}: ${err.message}`);
        response.sendStatus(400).json({ message: err.message });
        return;
      }
    }

    response.sendStatus(200);
  });
}
