# One time tasks after deployment.

This is a list of requests, which we need to call after deployment to migrate new data of process existing.

NOTE: `OUR_SECRET_KEY` is located inside 1Password under `AUCTION_SCHEDULER_SECRET` variable

#### relocate bids to bids collection

```
curl -d '{"key": "OUR_SECRET_KEY"}' -H "Content-Type: application/json" -H "User-Agent: Google-Cloud-Scheduler" -X POST https://dev.contrib.org/api/v1/relocate-bids-in-bid-collection
```

#### update attachments

```
curl -d '{"key": "OUR_SECRET_KEY"}' -H "Content-Type: application/json" -H "User-Agent: Google-Cloud-Scheduler" -X POST https://dev.contrib.org/api/v1/update-attachments
```
