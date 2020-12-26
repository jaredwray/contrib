# Contrib

## Setup

### Database

1. Install MongoDB locally using default ports etc.
2. Visit https://github.com/contriborg/database for more info

### Development

You will require:

1. VSCode
2. `node` (tested with 14.15.0)
3. Chrome (for debugging/launching from VS)
4. `crossenv` npm package globally installed `npm i -g crossenv`

To start:

1. Open the `contrib-app` folder in VS Code
2. In the status bar ensure `Debug with Chrome (website)` is selected
3. Use `Run > Start Debugging` from the menu or press <kbd>F5</kbd>

Testing:

1. Go to `/api/debug/setup-data` to reset auction states

## Technology used

- [x] TypeScript
- [x] NextJS
- [x] MongoDB
- [x] React + React/DOM
- [x] NextAuth
- [ ] Stripe
- [x] Google Cloud
- [x] [Directory NextJS theme](https://directory-rose.now.sh/docs/docs-next)
- [ ] NewRelic
- [ ] Twilio (SMS & Email)

## Social support

Social sign-in support is supported for:

- [x] FaceBook
- [x] Twitter
- [x] Google
- [ ] Apple

## Docker

* Build: `docker build --rm --pull -f "./Dockerfile" -t "contrib:latest" "./"`
* Run: `docker run --rm -d  -p 3000:3000/tcp contrib:latest`

# Deploy to [dev] and [live] environments

There are two environments that we have for deployment. By default checking your source code into `main` will deploy to https://dev.contrib.org which runs out of the [us-central1] region in Google Cloud and uses the Mongo Atlas cluster [contrib-dev-cluster-1] that is also based in that region. It is deployed on Cloud Run wich will scale automatically and also goes across availability zones for the runtime and database engine (MongoDB). 

The `live` environment is deployed across two regions and in each region across two availability zones. The regions are [us-west1] as primary and [us-central1] as secondary or based on geo location. The MongoDB is a Global cluster that spans across the two regions in Google Cloud. To deploy to production you most create a release in Github. Once you do that it will auto deploy all code to both regions and configuration. That simple!
