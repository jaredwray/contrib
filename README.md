# Contrib

## Setup

### Database

1. Install MongoDB locally using default ports etc.
2. Create a `contrib` database containing a `auctions` collection
3. Insert a sample auction, e.g.

```json
{
   "_id":{
      "$oid":"5f8761fed6d34e586f0dd448"
   },
   "title":"Sounders match-played soccer ball",
   "startAt":{
      "$date":"2020-10-15T16:00:00.000Z"
   },
   "endAt":{
      "$date":"2020-10-20T16:00:00.000Z"
   },
   "startPrice": 1199,
   "seller":{
      "id":"5f87628bd6d34e586f0dd44a",
      "name":"Xavi"
   },
   "location":{
      "country":"us",
      "zip":"98034",
      "city":"Seattle"
   },
   "active":true
}
```

### Development

You will require:

1. VSCode
2. `npm`
3. `node` (tested with 12.18.3)
4. Chrome (for debugging/launching from VS)

## Technology used

- [x] TypeScript
- [x] NextJS
- [x] MongoDB
- [x] React + React/DOM
- [ ] Auth0
- [ ] Stripe
- [ ] Google Cloud

## Endpoints

Right now there is just enough for an index page to establish a connection to the DB and render a list of auctions. (Does not use the API in accordance with the NextJS model)

There is also an api at `/api/auctions` that returns a list of Auctions as JSON and `/api/auctions/[id]` to return a singular Auction. 

## Next steps

1. Get Auth0 login and sign-up working
2. Get a default theme to flesh out UI look
3. Work on the Athlete, Fan and Auction models & get some realistic sample data setup
4. Create pages to show the Auctions
5. Allow fans to login
6. Allow fans to bid
