# Contrib

![tests](https://github.com/jaredwray/contrib/workflows/tests/badge.svg)
[![codecov](https://codecov.io/gh/contriborg/contrib-app/branch/main/graph/badge.svg?token=2LIYGRVN4F)](https://codecov.io/gh/contriborg/contrib-app)

## Developing locally

Yarn is used as a package manager. Therefore, npm commands are not used.

1. Install dependencies:
   - `yarn --cwd client install`
   - `yarn --cwd server install`
2. Get configuration properties for the backend:
   - create `./server/.env` file with contents from 1Password
3. Start up frontend:
   - `yarn --cwd client start`
4. Start up backend is separate tab:
   - `yarn --cwd server start`

## Using Docker Locally

1. Install Client / Server and Create Docker Image:
   - `yarn build`
2. Run Docker with Local `./server/.env`
   - make sure your PORT in `./server/.env` is set to 3000
   - `yarn docker-run`

## Technology used

- TypeScript
- Jest
- MongoDB
- React + React/DOM
- PassportJs
- Google Cloud
- NewRelic
- DotEnv (Config Management)
- Twilio (SMS & Email)

## Social support

Social sign-in support is supported for:

- FaceBook
- Twitter
- Google
- Apple

## Docker

- Build: `docker build --rm --pull -f "./Dockerfile" -t "contrib:latest" "./"`
- Run: `docker run --rm -d -p 3000:3000/tcp contrib:latest`

# Deploy to [dev] and [live] environments

There are two environments that we have for deployment. By default checking your source code into `main` will deploy to https://dev.contrib.org which runs out of the [us-central1] region in Google Cloud and uses the Mongo Atlas cluster [contrib-dev-cluster-1] that is also based in that region. It is deployed on Cloud Run wich will scale automatically and also goes across availability zones for the runtime and database engine (MongoDB).

The `live` environment is deployed across two regions and in each region across two availability zones. The regions are [us-west1] as primary and [us-central1] as secondary or based on geo location. The MongoDB is a Global cluster that spans across the two regions in Google Cloud named [contrib-dev-cluster-1]. To deploy to production you most create a release in Github. Once you do that it will auto deploy all code to both regions and configuration. That simple!

# Content / Object Storage

We use google cloud storage and there are two users for each environment (`dev` and `live`):

## `dev` environment:

- url: content-dev.contrib.org
- storage uri: content-dev.contrib.org
- storage writer: `content-writer@contrib-dev.iam.gserviceaccount.com`
- storage owner: `content-owner@contrib-dev.iam.gserviceaccount.com`
- content-writer `dev`: https://start.1password.com/open/i?a=HNGEPVTM65E5PCTBJRWRVIXSJU&v=w7wdwclxmm47sjsmfjeunxxqoa&i=gg3iaanezncldb3d3yasco4n7a&h=contrib.1password.com
- content-owner `dev`: https://start.1password.com/open/i?a=HNGEPVTM65E5PCTBJRWRVIXSJU&v=w7wdwclxmm47sjsmfjeunxxqoa&i=iatusb6hubb2pozq4qfamwecgm&h=contrib.1password.com

## `live` environment:

- url: content.contrib.org
- storage uri: content-live.contrib.org
- storage writer: `content-writer@contrib-live.iam.gserviceaccount.com`
- storage owner: `content-owner@contrib-live.iam.gserviceaccount.com`
- content-writer `live`: https://start.1password.com/open/i?a=HNGEPVTM65E5PCTBJRWRVIXSJU&v=w7wdwclxmm47sjsmfjeunxxqoa&i=gp42f74tfzg4vhsk5ifeamkd2i&h=contrib.1password.com
- content-owner `live`: https://start.1password.com/open/i?a=HNGEPVTM65E5PCTBJRWRVIXSJU&v=w7wdwclxmm47sjsmfjeunxxqoa&i=unlptfa6jbaixeodiwtk22vkay&h=contrib.1password.com

## UPS delivery:

To deliver auction winnings, we use UPS service.

You can find all the necessary information about UPS for development here: `https://www.ups.com/upsdeveloperkit?loc=en_US`.

## Authentication logic:

To authenticate users, we use the PassportJs library. We use 3 authentication strategies: Google, Facebook, Twitter.

To configure each of them to work correctly, you need to take the following steps:

### Auth with Google by passport.js:

1. Log in to the Google Cloud Platform.
2. Select the Contrib project.
3. Add the following links to the Authorized JavaScript origins field: `https://dev.contrib.org`, `https://contrib.org`, `https://live.contrib.org`, 
4. Add the following links to the Authorized Redirect URIs field: `https://dev.contrib.org/api/v1/auth/google/callback`, `https://contrib.org/api/v1/auth/google/callback`, `https://live.contrib.org/api/v1/auth/google/callback`.
5. Get Client ID and Client secret for GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET envs.
6. Register Google Strategy as indicated on this page: `http://www.passportjs.org/packages/passport-google-oauth20/`

### Auth with Facebook by passport.js:

1. Log in to the Facebook Developers.
2. Go to Facebook Login => Setting
3. Add the following links to the Valid OAuth Redirect URIs: `https://dev.contrib.org/api/v1/auth/facebook/callback`, `https://contrib.org/api/v1/auth/facebook/callback`, `https://live.contrib.org/api/v1/auth/facebook/callback`.
4. Get App ID and App Secret for FACEBOOK_APP_ID and FACEBOOK_APP_ID envs on the Settings => Basic.
5. Register Facebook Strategy as indicated on this page: `http://www.passportjs.org/packages/passport-facebook/`

### Auth with Twitter by passport.js: 

1. Log in to the Twittet Application Management.
2. Go to the Setting tab.
3. Add the following links to the Callback URLs: `https://dev.contrib.org/api/v1/auth/twitter/callback`, `https://contrib.org/api/v1/auth/twitter/callback`, `https://live.contrib.org/api/v1/auth/twitter/callback`.
4. Go to the API Keys tab, there you will find your Consumer key and Consumer secret keys for TWITTER_CONSUMER_KEY and TWITTER_CONSUMER_SECRET envs.
5. Register Twitter Strategy as indicated on this page: `http://www.passportjs.org/packages/passport-twitter/`


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

### Setup charities for testing purposes

1. Invite charity.
2. During onboarding in Stripe dashboard verify that all entered data is correct and there are no `red` warnings, since later you will not have opportunities to edit this data.
3. If all data is correct -in test mode Stripe accepts account immediately, you can check that account is completed in Stripe dasboard in `Connected accounts` section (before - enable button `Viewing Test data` )
4. Then you can check that webhook event sent in `Webhooks` section (check previous point).
5. You can verify in database that webhook event was processed and now `stripeAccountStatus` is `ACTIVE`
6. Add the required fields in Contrib's charity dashboard
7. Now you can attach given charity to auction

##### This flow almost same with flow expected in production excluding Stripe verification - it could take several days

## Editing connected account's capabilities

1. Sign in to Stripe `https://stripe.com/`
2. Go to `Connected account` section
3. Choose an account which you want to edit
4. Scroll down to `Capabilities` section
5. Press edit
6. Request or remove any capability

## configuring scheduled jobs for the auctions:

#### Configuring of the job:

NOTE: `OUR_SECRET_KEY` is located inside 1Password under `AUCTION_SCHEDULER_SECRET` variable

Run this via terminal on the correct projects

`contrib-live` GCloud Project

```
gcloud scheduler jobs create http contrib-auction-settle --schedule="*/5 * * * *" --uri="https://contrib.org/api/v1/auctions-settle" --http-method="post" --headers="Content-Type=application/json,User-Agent=Google-Cloud-Scheduler" --message-body="{ \"key\": \"OUR_SECRET_KEY\" }" --time-zone="America/Los_Angeles"

gcloud scheduler jobs create http contrib-notify-auction-end --schedule="* * * * *" --uri="https://contrib.org/api/v1/auctions-ends-notify" --http-method="post" --headers="Content-Type=application/json,User-Agent=Google-Cloud-Scheduler" --message-body="{ \"key\": \"OUR_SECRET_KEY\" }" --time-zone="America/Los_Angeles"
```

`contrib-dev` GCloud Project

```
gcloud scheduler jobs create http contrib-auction-settle --schedule="*/5 * * * *" --uri="https://dev.contrib.org/api/v1/auctions-settle" --http-method="post" --headers="Content-Type=application/json,User-Agent=Google-Cloud-Scheduler" --message-body="{ \"key\": \"OUR_SECRET_KEY\" }" --time-zone="America/Los_Angeles"

gcloud scheduler jobs create http contrib-notify-auction-end --schedule="* * * * *" --uri="https://dev.contrib.org/api/v1/auctions-ends-notify" --http-method="post" --headers="Content-Type=application/json,User-Agent=Google-Cloud-Scheduler" --message-body="{ \"key\": \"OUR_SECRET_KEY\" }" --time-zone="America/Los_Angeles"
```

##### using Cloud Scheduler.

Go to Google Cloud Scheduler: https://console.cloud.google.com/cloudscheduler?project=contrib-dev and create follow jobs:

|Name|Description|Frequency|Timezone|Target type|URL|HTTP method|HTTP headers|Body|
|---|---|---|---|---|---|---|---|---|
| contrib-auction-settle     | end auctions (change status to SETTLED)  | * * * * * | America/Los_Angeles | HTTP        | https://contrib.org/api/v1/auctions-settle      | POST        | Content-Type: application/json | { "key": "OUR_SECRET_KEY" } |
| contrib-notify-auction-end | send notifications                       | * * * * * | America/Los_Angeles | HTTP        | https://contrib.org/api/v1/auctions-ends-notify | POST        | Content-Type: application/json | { "key": "OUR_SECRET_KEY" } |