import { gql } from '@apollo/client';

export const ContentStorageAuthDataQuery = gql`
  query ContentStorageAuthDataQuery {
    getContentStorageAuthData {
      authToken
      accountId
    }
  }
`;

export const AuctionMetricsQuery = gql`
  query AuctionMetrics($auctionId: String!) {
    getAuctionMetrics(auctionId: $auctionId) {
      clicks {
        date
        clicks
      }
      clicksByDay {
        date
        clicks
      }
      countries {
        value
        clicks
      }
      referrers {
        value
        clicks
      }
      browsers {
        value
        clicks
      }
      oss {
        value
        clicks
      }
    }
  }
`;

export const CustomerInformationQuery = gql`
  query CustomerInformation($stripeCustomerId: String!) {
    getCustomerInformation(stripeCustomerId: $stripeCustomerId) {
      phone
      email
    }
  }
`;

export const AuctionForAdminPageQuery = gql`
  query AuctionForAdminPage($id: String!) {
    auction(id: $id) {
      id
      title
      status
      startsAt
      endsAt
      startPrice
      bitlyLink
      bidStep
      shortLink {
        slug
      }
      currentPrice
      fairMarketValue
      password
      items {
        id
        name
        contributor
        fairMarketValue
      }
      auctionOrganizer {
        id
        name
      }
      charity {
        id
        name
        semanticId
        stripeAccountId
      }
      delivery {
        shippingLabel
        parcel {
          width
          length
          height
          weight
        }
        address {
          name
          country
          state
          city
          zipCode
          street
          phoneNumber
        }
        timeInTransit
        identificationNumber
        status
        updatedAt
      }
      winner {
        mongodbId
        address {
          name
          country
          state
          city
          zipCode
          street
          phoneNumber
        }
      }
      isFailed
      isActive
      isSold
      isSettled
    }
  }
`;

export const AuctionPriceLimitsQuery = gql`
  query AuctionPriceLimits($filters: AuctionSearchFilters, $query: String, $statusFilter: [String]) {
    auctionPriceLimits(filters: $filters, query: $query, statusFilter: $statusFilter) {
      max
      min
    }
  }
`;

export const AuctionQuery = gql`
  query Auction($id: String!) {
    auction(id: $id) {
      id
      startsAt
      endsAt
      stoppedAt
      startPrice
      title
      bitlyLink
      shortLink {
        slug
        shortLink
      }
      description
      status
      itemPrice
      isActive
      isDraft
      isSettled
      isFailed
      isSold
      isStopped
      startPrice
      bidStep
      totalBids
      fairMarketValue
      password
      items {
        id
        name
        contributor
        fairMarketValue
      }
      currentPrice
      auctionOrganizer {
        id
        name
        avatarUrl
      }
      attachments {
        uid
        url
        type
        cloudflareUrl
        thumbnail
        forCover
      }
      charity {
        id
        name
        semanticId
        avatarUrl
        websiteUrl
        status
      }
      followers {
        user
        createdAt
      }
      winner {
        mongodbId
        phoneNumber
        address {
          name
          country
          state
          city
          zipCode
          street
          phoneNumber
        }
      }
      delivery {
        identificationNumber
        timeInTransit
        status
        shippingLabel
        address {
          name
          country
          state
          city
          zipCode
          street
          phoneNumber
        }
      }
    }
  }
`;

export const AuctionsListQuery = gql`
  query AuctionsList(
    $size: Int
    $skip: Int
    $query: String
    $orderBy: String
    $filters: AuctionSearchFilters
    $statusFilter: [String]
  ) {
    auctions(
      size: $size
      skip: $skip
      query: $query
      orderBy: $orderBy
      filters: $filters
      statusFilter: $statusFilter
    ) {
      totalItems
      size
      skip
      items {
        id
        currentPrice
        totalBids
        status
        isActive
        isDraft
        isSettled
        isFailed
        isSold
        isStopped
        title
        startPrice
        bidStep
        itemPrice
        startsAt
        stoppedAt
        endsAt
        password
        auctionOrganizer {
          id
          name
          avatarUrl
        }
        charity {
          id
          name
          avatarUrl
          semanticId
        }
        attachments {
          type
          url
          thumbnail
        }
        followers {
          user
        }
        delivery {
          parcel {
            width
            length
            height
            weight
          }
        }
      }
    }
  }
`;

export const GetAuctionMediaQuery = gql`
  query GetAuctionMedia($id: String!) {
    auction(id: $id) {
      id
      isActive
      title
      auctionOrganizer {
        id
      }
      attachments {
        id
        uid
        url
        type
        cloudflareUrl
        thumbnail
      }
    }
  }
`;

export const CalculateShippingCostQuery = gql`
  query CalculateShippingCost($auctionId: String!, $deliveryMethod: String!) {
    calculateShippingCost(auctionId: $auctionId, deliveryMethod: $deliveryMethod) {
      deliveryPrice
      timeInTransit
    }
  }
`;

export const GetAuctionDetailsQuery = gql`
  query GetAuctionDetails($id: String!) {
    auction(id: $id) {
      id
      endsAt
      itemPrice
      bidStep
      title
      description
      status
      isActive
      startPrice
      startsAt
      fairMarketValue
      password
      items {
        id
        name
        contributor
        fairMarketValue
      }
      charity {
        id
        name
      }
      auctionOrganizer {
        id
        favoriteCharities {
          id
          name
        }
      }
      attachments {
        type
      }
    }
  }
`;

export const UpdateOrCreateAuctionMetricsMutation = gql`
  mutation UpdateOrCreateMetrics($shortLinkId: String, $referrer: String, $country: String, $userAgentData: String) {
    updateOrCreateMetrics(
      shortLinkId: $shortLinkId
      input: { referrer: $referrer, country: $country, userAgentData: $userAgentData }
    ) {
      id
    }
  }
`;

export const ShippingRegistrationMutation = gql`
  mutation ShippingRegistration(
    $auctionId: String!
    $deliveryMethod: String
    $timeInTransit: DateTime
    $auctionWinnerId: String
  ) {
    shippingRegistration(
      input: {
        auctionId: $auctionId
        deliveryMethod: $deliveryMethod
        timeInTransit: $timeInTransit
        auctionWinnerId: $auctionWinnerId
      }
    ) {
      deliveryPrice
      identificationNumber
    }
  }
`;

export const UpdateAuctionParcelMutation = gql`
  mutation UpdateAuctionParcel(
    $auctionId: String!
    $width: String!
    $height: String!
    $length: String!
    $weight: String!
  ) {
    updateAuctionParcel(
      auctionId: $auctionId
      input: { width: $width, height: $height, length: $length, weight: $weight }
    ) {
      width
      height
      length
      weight
    }
  }
`;

export const ChargeCurrentAuctionMutation = gql`
  mutation ChargeCurrentAuction($id: String!) {
    chargeAuction(id: $id) {
      id
    }
  }
`;

export const CreateAuctionMutation = gql`
  mutation CreateAuction($input: AuctionInput!) {
    createAuction(input: $input) {
      id
    }
  }
`;

export const UpdateAuctionMutation = gql`
  mutation UpdateAuction($id: String!, $input: AuctionInput!) {
    updateAuction(id: $id, input: $input) {
      id
      description
      title
      startsAt
      endsAt
      startPrice
      bidStep
      itemPrice
      fairMarketValue
      items {
        id
        name
        contributor
        fairMarketValue
      }
      charity {
        id
        name
      }
      attachments {
        type
      }
    }
  }
`;

export const AddAuctionMediaMutation = gql`
  mutation AddAuctionMedia($id: String!, $input: AuctionAttachmentInput!) {
    addAuctionAttachment(id: $id, input: $input) {
      type
      thumbnail
      url
    }
  }
`;

export const DeleteAuctionMediaMutation = gql`
  mutation DeleteAuctionMedia($auctionId: String!, $attachmentId: String!) {
    deleteAuctionAttachment(auctionId: $auctionId, attachmentId: $attachmentId) {
      id
      url
      type
      cloudflareUrl
      thumbnail
      uid
    }
  }
`;

export const BuyAuctionMutation = gql`
  mutation BuyAuction($id: String!) {
    buyAuction(id: $id) {
      status
    }
  }
`;

export const StopAuctionMutation = gql`
  mutation StopAuction($id: String!) {
    stopAuction(id: $id) {
      status
    }
  }
`;

export const ActivateAuctionMutation = gql`
  mutation ActivateAuction($id: String!) {
    activateAuction(id: $id) {
      status
    }
  }
`;

export const FinishAuctionCreationMutation = gql`
  mutation FinishAuctionCreation($id: String!) {
    finishAuctionCreation(id: $id) {
      id
    }
  }
`;

export const DeleteAuctionMutation = gql`
  mutation DeleteAuction($id: String!) {
    deleteAuction(id: $id) {
      id
    }
  }
`;

export const FollowAuctionMutation = gql`
  mutation FollowAuction($auctionId: String!) {
    followAuction(auctionId: $auctionId) {
      user
      createdAt
    }
  }
`;

export const UnfollowAuctionMutation = gql`
  mutation UnfollowAuction($auctionId: String!) {
    unfollowAuction(auctionId: $auctionId) {
      id
    }
  }
`;

export const AuctionSubscription = gql`
  subscription Auction {
    auction {
      followers {
        user
        createdAt
      }
      status
      currentPrice
      endsAt
      stoppedAt
      totalBids
      isActive
      isDraft
      isSettled
      isFailed
      isSold
      isStopped
    }
  }
`;

export const TotalRaisedAmountQuery = gql`
  query TotalRaisedAmount {
    totalRaisedAmount
  }
`;
