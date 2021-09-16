# Contrib

![deploy-to-dev](https://github.com/contriborg/contrib-app/workflows/deploy-to-dev/badge.svg)
![deploy-to-live](https://github.com/contriborg/contrib-app/workflows/deploy-to-live/badge.svg)
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
- Auth0
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

Description of fields of the required data specified in the .env file:

1. UPS_DELIVERY_CONTRIB_DATA - required sender data, further in more detail about some of these data fields:

   # address

   The Shipper street address including name and number (when applicable). Up to three occurrences are allowed; only the first is printed on the
   label. 35 characters are accepted, but for the first occurrence, only 30 characters will be printed on the label for return shipments.

   # city

   Shipper's City. For forward Shipment 30 characters are accepted, but only 15 characters will be printed on the label.

   # state

   Shipper's state or province code.

   # zipCode

   Shipper's postal code.

   # phoneNumber

   Shipper's phone number.

   # shipperNumber

   Shipper’s six digit alphanumeric account number. Must be associated with the UserId specified in the AccessRequest. The account must be a valid UPS account number that is active.

2. UPS_CONTRIB_CARD_DATA - details of the card from which payment for delivery will be made, further in more detail about some of these data fields:

   # type

   Card type value. You need to choose the right option for your card from the list below:

   01 = American Express
   03 = Discover
   04 = MasterCard
   05 = Optima
   06 = VISA
   07 = Bravo
   08 = Diners Club
   13 = Dankort
   14 = Hipercard
   15 = JCB
   17 = Postepay
   18 = UnionPay/ExpressPay
   19 = Visa Electron
   20 = VPAY
   21 = Carte Bleue

   # number

   Credit Card number. Length: 9-16.

   # expirationDate

   Format is MMYYYY where MM is the 2 digit month and YYYY is the 4 digit year. Valid month values are 01-12 and valid year
   values are Present Year – (Present Year + 10 years).

   # securityCode

   Three or four digits that can be found either on top of credit card number or on the back of credit card. Number of digits varies for
   different type of credit card.

3. UPS_DELIVERY_REQUEST_HEADER - data required to form a request to UPS, further in more detail about some of these data fields:

   # AccessLicenseNumber

   Authorization: Access Key obtained through on-boarding process. Contact your UPS representative for additional information.

   # Password

   The customers MyUPS password.

   # Username

   The customers MyUPS username.

   ====================

   You can find all the necessary information about UPS for development here: `https://www.ups.com/upsdeveloperkit?loc=en_US`.

   ====================

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


gcloud scheduler jobs create http contrib-auction-start --schedule="* * * * *" --uri="https://contrib.org/api/v1/auctions-start" --http-method="post" --headers="Content-Type=application/json,User-Agent=Google-Cloud-Scheduler" --message-body="{ \"key\": \"OUR_SECRET_KEY\" }" --time-zone="America/Los_Angeles"

gcloud scheduler jobs create http contrib-notify-auction-end --schedule="* * * * *" --uri="https://contrib.org/api/v1/auctions-ends-notify" --http-method="post" --headers="Content-Type=application/json,User-Agent=Google-Cloud-Scheduler" --message-body="{ \"key\": \"OUR_SECRET_KEY\" }" --time-zone="America/Los_Angeles"

gcloud scheduler jobs create http auctions-metrics --schedule="0 * * * *" --uri="https://contrib.org/api/v1/auctions-metrics" --http-method="post" --headers="Content-Type=application/json,User-Agent=Google-Cloud-Scheduler" --message-body="{ \"key\": \"OUR_SECRET_KEY\" }" --time-zone="America/Los_Angeles"
```

`contrib-dev` GCloud Project

```
gcloud scheduler jobs create http contrib-auction-settle --schedule="*/5 * * * *" --uri="https://dev.contrib.org/api/v1/auctions-settle" --http-method="post" --headers="Content-Type=application/json,User-Agent=Google-Cloud-Scheduler" --message-body="{ \"key\": \"OUR_SECRET_KEY\" }" --time-zone="America/Los_Angeles"

gcloud scheduler jobs create http contrib-auction-start --schedule="* * * * *" --uri="https://dev.contrib.org/api/v1/auctions-start" --http-method="post" --headers="Content-Type=application/json,User-Agent=Google-Cloud-Scheduler" --message-body="{ \"key\": \"OUR_SECRET_KEY\" }" --time-zone="America/Los_Angeles"

gcloud scheduler jobs create http contrib-notify-auction-end --schedule="* * * * *" --uri="https://dev.contrib.org/api/v1/auctions-ends-notify" --http-method="post" --headers="Content-Type=application/json,User-Agent=Google-Cloud-Scheduler" --message-body="{ \"key\": \"OUR_SECRET_KEY\" }" --time-zone="America/Los_Angeles"

gcloud scheduler jobs create http auctions-metrics --schedule="0 * * * *" --uri="https://dev.contrib.org/api/v1/auctions-metrics" --http-method="post" --headers="Content-Type=application/json,User-Agent=Google-Cloud-Scheduler" --message-body="{ \"key\": \"OUR_SECRET_KEY\" }" --time-zone="America/Los_Angeles"

```

##### using Cloud Scheduler.

Go to Google Cloud Scheduler: https://console.cloud.google.com/cloudscheduler?project=contrib-dev and create follow jobs:

|Name|Description|Frequency|Timezone|Target type|URL|HTTP method|HTTP headers|Body|
|---|---|---|---|---|---|---|---|---|
| contrib-auction-settle     | end auctions (change status to SETTLED)  | * * * * * | America/Los_Angeles | HTTP        | https://contrib.org/api/v1/auctions-settle      | POST        | Content-Type: application/json | { "key": "OUR_SECRET_KEY" } |
| contrib-auction-start      | start auctions (change status to ACTIVE) | * * * * * | America/Los_Angeles | HTTP        | https://contrib.org/api/v1/auctions-start       | POST        | Content-Type: application/json | { "key": "OUR_SECRET_KEY" } |
| contrib-notify-auction-end | send notifications                       | * * * * * | America/Los_Angeles | HTTP        | https://contrib.org/api/v1/auctions-ends-notify | POST        | Content-Type: application/json | { "key": "OUR_SECRET_KEY" } |
| metrics_from_bitly         | import metrics from bitly                | 0 * * * * | America/Los_Angeles | HTTP        | https://contrib.org/api/v1/auctions-metrics     | POST        | Content-Type: application/json | { "key": "OUR_SECRET_KEY" } |
