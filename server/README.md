# Contrib server package

## Running locally

1. Install dependencies: `$ yarn`
2. Copy `.env` file from 1password
3. Copy `.secrets-google-cloud.json` file from 1password
4. Run server in dev setup: `$ yarn start`

## Setup webhook to notify application when an event happens in an account

1. Sign in to Stripe `https://stripe.com/`
2. Go to `Developers/Webhooks` section
3. If needs to receive events from customer's accounts connected to the Contrib's account - press `Add endpoint` in `Endpoints receiving events from Connect applications` section
4. If needs to receive event from personal account - press `Add endpoint` in `Endpoints receiving events from your account`
5. In the appeared window enter the URL which will receive Stripe events on the server
6. Enter description
7. Select several events in `Events to send` section or press button `receive all events`
8. Press `Add endpoint`
9. Check the secret key in `Sign in secret` section

Now webhook added and registered on Stripe side. On server side add new evn var with value from `Sign in secret` section.
This value will be used to check webhook signature when event will be received.

Every webhook will have personal sign in secret, so for every new webhook will require personal env var with defined secret value
