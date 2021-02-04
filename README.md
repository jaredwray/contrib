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



## Technology used

* TypeScript
* Jest
* MongoDB
* React + React/DOM
* Auth0
* Google Cloud
* NewRelic
* DotEnv (Config Management)
* Twilio (SMS & Email)

## Social support

Social sign-in support is supported for:

* FaceBook
* Twitter
* Google
* Apple

## Docker

* Build: `docker build --rm --pull -f "./Dockerfile" -t "contrib:latest" "./"`
* Run: `docker run --rm -d  -p 3000:3000/tcp contrib:latest`

# Deploy to [dev] and [live] environments

There are two environments that we have for deployment. By default checking your source code into `main` will deploy to https://dev.contrib.org which runs out of the [us-central1] region in Google Cloud and uses the Mongo Atlas cluster [contrib-dev-cluster-1] that is also based in that region. It is deployed on Cloud Run wich will scale automatically and also goes across availability zones for the runtime and database engine (MongoDB). 

The `live` environment is deployed across two regions and in each region across two availability zones. The regions are [us-west1] as primary and [us-central1] as secondary or based on geo location. The MongoDB is a Global cluster that spans across the two regions in Google Cloud named [contrib-dev-cluster-1]. To deploy to production you most create a release in Github. Once you do that it will auto deploy all code to both regions and configuration. That simple!
