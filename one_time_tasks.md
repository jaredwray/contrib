# One time tasks after deployment.

This is a list of requests, which we need to call after deployment to migrate new data of process existing.

NOTE: `OUR_SECRET_KEY` is located inside 1Password under `AUCTION_SCHEDULER_SECRET` variable

#### update Stripe customers adress info

```
curl -d '{"key": "OUR_SECRET_KEY"}' -H "Content-Type: application/json" -X POST https://contrib.org/api/v1/update-stripe-customer-address
```

#### update bidStep for auctions

```
curl -d '{"key": "OUR_SECRET_KEY"}' -H "Content-Type: application/json" -X POST https://contrib.org/api/v1/update-auctions-bid-step
```
