# Contrib


### Development


## Technology used

- [ ] TypeScript
- [ ] Jest
- [ ] MongoDB
- [ ] React + React/DOM
- [ ] Auth0
- [ ] Stripe
- [ ] Google Cloud
- [ ] NewRelic
- [ ] DotEnv (Config Management)
- [ ] Twilio (SMS & Email)

## Social support

Social sign-in support is supported for:

- [ ] FaceBook
- [ ] Twitter
- [ ] Google
- [ ] Apple

## Docker

* Build: `docker build --rm --pull -f "./Dockerfile" -t "contrib:latest" "./"`
* Run: `docker run --rm -d  -p 3000:3000/tcp contrib:latest`

# Deploy to [dev] and [live] environments

There are two environments that we have for deployment. By default checking your source code into `main` will deploy to https://dev.contrib.org which runs out of the [us-central1] region in Google Cloud and uses the Mongo Atlas cluster [contrib-dev-cluster-1] that is also based in that region. It is deployed on Cloud Run wich will scale automatically and also goes across availability zones for the runtime and database engine (MongoDB). 

The `live` environment is deployed across two regions and in each region across two availability zones. The regions are [us-west1] as primary and [us-central1] as secondary or based on geo location. The MongoDB is a Global cluster that spans across the two regions in Google Cloud named [contrib-dev-cluster-1]. To deploy to production you most create a release in Github. Once you do that it will auto deploy all code to both regions and configuration. That simple!
