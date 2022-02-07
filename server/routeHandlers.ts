import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import { IAppServices } from './app/AppServices';
import { AppConfig } from './config';
import { isAuthorizedRequest } from './helpers/isAuthorizedRequest';
import { AppLogger } from './logger';

export default function appRouteHandlers(
  app: express.Express,
  { auction, charity, stripeService, twilioNotification, userAccount }: IAppServices,
): void {
  app.use((req, res, next) => {
    if (['/api/v1/stripe/'].includes(req.originalUrl)) {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  //TODO: delete after update sms aythzIds
  app.post('/api/v1/update-stripe-customer-address', async (req, res) => {
    if (!isAuthorizedRequest(req, res)) return;

    await userAccount.updateCustomersAddress();

    res.sendStatus(200);
  });
  //TODO ends

  //TODO: delete after update auctions bid step
  app.post('/api/v1/update-auctions-bid-step', async (req, res) => {
    if (!isAuthorizedRequest(req, res)) return;

    await auction.updateAuctionsBidStep();

    res.sendStatus(200);
  });
  //TODO ends

  app.post('/api/v1/auctions-settle', async (req, res) => {
    if (!isAuthorizedRequest(req, res)) return;

    const response = await auction.scheduleAuctionJobSettle();
    return res.json(response);
  });

  app.post('/api/v1/auctions-ends-notify', async (req, res) => {
    if (!isAuthorizedRequest(req, res)) return;

    const response = await auction.scheduleAuctionEndsNotification();
    return res.json(response);
  });

  app.post('/api/v1/notification', bodyParser.raw({ type: 'application/octet-stream' }), async (req, res) => {
    const parsedBody = JSON.parse(req.body);

    if (!parsedBody) {
      res.sendStatus(400).json({ message: 'BAD REQUEST' });
      return;
    }

    if (parsedBody.api_token !== AppConfig.googleCloud.task.googleTaskApiToken) {
      res.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
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

    await charity.setDefaultCharityStripeStatus(userId);
    res.redirect(`${AppConfig.app.url}/charity/me/edit`);
  });

  app.post('/api/v1/auth/sms', (req, res, next) => {
    passport.authenticate('sms', (err, user) => {
      if (err) return res.status(400).send({ error: { message: err.message } });

      req.logIn(user, (err) => {
        if (err) return res.status(400).send({ error: { message: err.message } });

        return res.status(200).send({ message: 'Authorized' });
      });
    })(req, res, next);
  });

  app.get('/api/v1/auth/google', (req, res, next) => {
    req.session.redirectURL = req.query.redirectURL;

    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res, next);
  });

  app.get(
    '/api/v1/auth/google/callback',
    passport.authenticate('google', {
      failureMessage: 'Cannot login to Google, please try again later',
      failureRedirect: `${AppConfig.app.url}/404`,
    }),
    (req, res) => {
      const redirectURL = req.session.redirectURL;
      delete req.session.redirectURL;
      res.redirect(redirectURL || `${AppConfig.app.url}/after-login`);
    },
  );

  app.get('/api/v1/auth/facebook', (req, res, next) => {
    req.session.redirectURL = req.query.redirectURL;

    passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
  });

  app.get(
    '/api/v1/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureMessage: 'Cannot login to Facebook, please try again later',
      failureRedirect: `${AppConfig.app.url}/404`,
    }),
    (req, res) => {
      const redirectURL = req.session.redirectURL;
      delete req.session.redirectURL;
      res.redirect(redirectURL || `${AppConfig.app.url}/after-login`);
    },
  );

  app.get('/api/v1/auth/twitter', (req, res, next) => {
    req.session.redirectURL = req.query.redirectURL;

    passport.authenticate('twitter')(req, res, next);
  });

  app.get(
    '/api/v1/auth/twitter/callback',
    passport.authenticate('twitter', {
      failureMessage: 'Cannot login to Twitter, please try again later ',
      failureRedirect: `${AppConfig.app.url}/404`,
    }),
    (req, res) => {
      const redirectURL = req.session.redirectURL;
      delete req.session.redirectURL;
      res.redirect(redirectURL || `${AppConfig.app.url}/after-login`);
    },
  );

  app.get('/api/v1/auth/user', (req, res) => {
    res.json({
      user: req.user,
      isAuthenticated: req.isAuthenticated(),
    });
  });

  app.get('/api/v1/auth/logout', (req, res) => {
    const redirectURL = req?.query?.redirectURL?.toString();
    req.logOut();
    res.redirect(redirectURL || AppConfig.app.url);
  });

  app.post('/api/v1/stripe/', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];

    if (!sig) {
      response.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      AppLogger.error(
        `Unauthorized request received!\nPath: ${request.route.path};\nHeaders: ${JSON.stringify(
          request.headers,
          null,
          2,
        )}`,
      );
      return;
    }

    let event;
    try {
      event = stripeService.constructEvent(request.body, sig as string);
    } catch (err) {
      AppLogger.error(`Cannot handle the Stripe event, ${event.type}: ${err.message}`);
      response.sendStatus(400).json({ message: err.message });
      return;
    }

    if (event.type === 'account.updated') {
      try {
        await charity.updateCharityByStripeAccount(event.data.object);
      } catch (err) {
        AppLogger.warn(`Cannot update charity by stripe account with id#${event.data.object.id}: ${err.message}`);
        response.sendStatus(400).json({ message: err.message });
        return;
      }
    }

    response.sendStatus(200);
  });
}
