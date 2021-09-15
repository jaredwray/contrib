import { gql } from '@apollo/client';

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
      startDate
      endDate
      startPrice
      currentPrice
      fairMarketValue
      link
      auctionOrganizer {
        id
        name
      }
      charity {
        id
        name
        stripeAccountId
      }
      delivery {
        shippingLabel
        parcel {
          width
          length
          height
          weight
          units
        }
        address {
          name
          country
          state
          city
          zipCode
          street
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
        }
      }
      isFailed
      isActive
      isSold
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
export const GetTotalRaisedAmountQuery = gql`
  query GetTotalRaisedAmount($influencerId: String, $charityId: String) {
    getTotalRaisedAmount(influencerId: $influencerId, charityId: $charityId) {
      totalRaisedAmount
    }
  }
`;

export const AuctionQuery = gql`
  query Auction($id: String!) {
    auction(id: $id) {
      id
      startDate
      endDate
      stoppedAt
      startPrice
      title
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
      totalBids
      link
      fairMarketValue
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
      }
      charity {
        id
        name
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
        }
      }
      delivery {
        identificationNumber
        timeInTransit
        status
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
        itemPrice
        startDate
        endDate
        auctionOrganizer {
          id
          name
          avatarUrl
        }
        attachments {
          type
          url
          thumbnail
        }
        fairMarketValue
        followers {
          user
        }
        delivery {
          parcel {
            width
            length
            height
            weight
            units
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
    $units: String!
  ) {
    updateAuctionParcel(
      auctionId: $auctionId
      input: { width: $width, height: $height, length: $length, weight: $weight, units: $units }
    ) {
      width
      height
      length
      weight
      units
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
  mutation CreateAuction($organizerId: String, $title: String!) {
    createAuction(input: { title: $title, organizerId: $organizerId }) {
      id
      title
    }
  }
`;

export const GetAuctionDetailsQuery = gql`
  query GetAuctionDetails($id: String!) {
    auction(id: $id) {
      id
      endDate
      itemPrice
      title
      link
      description
      status
      isActive
      startPrice
      startDate
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

export const UpdateAuctionMutation = gql`
  mutation UpdateAuction(
    $id: String!
    $title: String
    $description: String
    $startDate: DateTime
    $endDate: DateTime
    $startPrice: Money
    $itemPrice: Money
    $charity: String
    $fairMarketValue: Money
    $duration: Int
  ) {
    updateAuction(
      id: $id
      input: {
        description: $description
        title: $title
        startDate: $startDate
        endDate: $endDate
        startPrice: $startPrice
        itemPrice: $itemPrice
        charity: $charity
        fairMarketValue: $fairMarketValue
        duration: $duration
      }
    ) {
      id
      description
      title
      link
      startDate
      endDate
      startPrice
      itemPrice
      fairMarketValue
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
  mutation AddAuctionMedia($id: String!, $file: Upload, $url: String, $filename: String) {
    addAuctionAttachment(id: $id, attachment: $file, url: $url, filename: $filename) {
      url
      type
      cloudflareUrl
      thumbnail
      uid
      originalFileName
    }
  }
`;

export const DeleteAuctionMediaMutation = gql`
  mutation DeleteAuctionMedia($id: String!, $url: String!) {
    deleteAuctionAttachment(id: $id, attachmentUrl: $url) {
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
      endDate
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
