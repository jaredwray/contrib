# One time jobs after deployment.

This is a list of jobs, which we need to call after deployment to migrate new data of process existing.

### using Cloud Scheduler.

NOTE: `OUR_SECRET_KEY` is located inside 1Password under `AUCTION_SCHEDULER_SECRET` variable

Go to Google Cloud Scheduler: https://console.cloud.google.com/cloudscheduler?project=contrib-dev and create follow jobs:

|Name|Description|Frequency|Timezone|Target type|URL|HTTP method|HTTP headers|Body|
|---|---|---|---|---|---|---|---|---|
| relocate-bids-in-bid-collection | relocate bids in bids collection | 0 0 1 1 0 | UTC | HTTP | https://dev.contrib.org/api/v1/relocate-bids-in-bid-collection | POST        | Content-Type: application/json &nbsp;User-Agent: Google-Cloud-Scheduler | { "key": "OUR_SECRET_KEY" } |

call RUN NOW and then you can remove that jobs.
