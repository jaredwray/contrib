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
      timeZone
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
      parcel {
        width
        length
        height
        weight
        units
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
      gameWorn
      autographed
      authenticityCertificate
      playedIn
      description
      fullPageDescription
      status
      itemPrice
      isActive
      isDraft
      isPending
      isSettled
      isFailed
      isSold
      isStopped
      startPrice
      totalBids
      link
      fairMarketValue
      currentPrice
      timeZone
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
        isPending
        isSettled
        isFailed
        isSold
        isStopped
        title
        description
        startPrice
        itemPrice
        startDate
        timeZone
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
`;

export const SportsQuery = gql`
  query Sports {
    sports
  }
`;

export const GetAuctionBasicsQuery = gql`
  query GetAuctionBasics($id: String!) {
    auction(id: $id) {
      id
      title
      sport
      gameWorn
      link
      autographed
      authenticityCertificate
      playedIn
      description
      fullPageDescription
      status
      isActive
      auctionOrganizer {
        id
      }
    }
  }
`;

export const GetAuctionMediaQuery = gql`
  query GetAuctionMedia($id: String!) {
    auction(id: $id) {
      isActive
      title
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

export const GetAuctionDetailsQuery = gql`
  query GetAuctionDetails($id: String!) {
    auction(id: $id) {
      id
      title
      startDate
      timeZone
      endDate
      itemPrice
      startPrice
      link
      isActive
      charity {
        id
        name
      }
      auctionOrganizer {
        favoriteCharities {
          id
          name
        }
      }
    }
  }
`;

export const UpdateAuctionParcelMutation = gql`
  mutation UpdateAuctionParcel(
    $auctionId: String!
    $width: Int!
    $height: Int!
    $length: Int!
    $weight: Int!
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
  mutation CreateAuction(
    $organizerId: String
    $title: String!
    $sport: String!
    $gameWorn: Boolean
    $autographed: Boolean
    $authenticityCertificate: Boolean
    $playedIn: String
    $description: String
    $fullPageDescription: String
  ) {
    createAuction(
      input: {
        organizerId: $organizerId
        description: $description
        fullPageDescription: $fullPageDescription
        gameWorn: $gameWorn
        autographed: $autographed
        playedIn: $playedIn
        title: $title
        sport: $sport
        authenticityCertificate: $authenticityCertificate
      }
    ) {
      id
      description
      fullPageDescription
      gameWorn
      autographed
      playedIn
      title
      sport
      authenticityCertificate
      link
    }
  }
`;

export const UpdateAuctionBasicsMutation = gql`
  mutation UpdateAuctionBasics(
    $id: String!
    $title: String!
    $sport: String!
    $gameWorn: Boolean
    $autographed: Boolean
    $authenticityCertificate: Boolean
    $playedIn: String
    $description: String
    $fullPageDescription: String
  ) {
    updateAuction(
      id: $id
      input: {
        description: $description
        sport: $sport
        fullPageDescription: $fullPageDescription
        gameWorn: $gameWorn
        autographed: $autographed
        playedIn: $playedIn
        title: $title
        authenticityCertificate: $authenticityCertificate
      }
    ) {
      id
      description
      sport
      fullPageDescription
      gameWorn
      autographed
      playedIn
      title
      authenticityCertificate
      link
    }
  }
`;

export const UpdateAuctionDetailsMutation = gql`
  mutation UpdateAuctionDetails(
    $id: String!
    $startDate: DateTime
    $endDate: DateTime
    $startPrice: Money
    $itemPrice: Money
    $charity: String
    $fairMarketValue: Money
    $timeZone: String
  ) {
    updateAuction(
      id: $id
      input: {
        startDate: $startDate
        endDate: $endDate
        startPrice: $startPrice
        itemPrice: $itemPrice
        charity: $charity
        fairMarketValue: $fairMarketValue
        timeZone: $timeZone
      }
    ) {
      id
      startDate
      endDate
      startPrice
      itemPrice
      charity {
        id
        name
      }
    }
  }
`;

export const AddAuctionMediaMutation = gql`
  mutation AddAuctionMedia($id: String!, $file: Upload!) {
    addAuctionAttachment(id: $id, attachment: $file) {
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
