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

## Technology used

- [x] TypeScript
- [x] NextJS
- [x] MongoDB
- [x] React + React/DOM
- [x] NextAuth
- [ ] Stripe
- [ ] Google Cloud
- [x] [Directory NextJS theme](https://directory-rose.now.sh/docs/docs-next)
- [ ] NewRelic

## Social support

Social sign-in support is supported for:

- [x] FaceBook
- [x] Twitter
- [x] Google
- [ ] Apple

## Next steps

- [x] Allow fans to sign in
- [x] Work on the Athlete, Fan and Auction models & get some realistic sample data setup
- [x] Create pages to show the Auctions
- [x] Create charity pages
- [ ] Allow fans to bid

## Docker

* Build: `docker build --rm --pull -f "./Dockerfile" -t "contrib:latest" "./"`
* Run: `docker run --rm -d  -p 3000:3000/tcp contrib:latest`
