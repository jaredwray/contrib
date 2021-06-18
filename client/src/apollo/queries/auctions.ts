import { gql } from '@apollo/client';

export const CustomerInformation = gql`
  query CustomerInformation($stripeCustomerId: String!) {
    getCustomerInformation(stripeCustomerId: $stripeCustomerId) {
      phone
      email
    }
  }
`;

export const AuctionForAdminPage = gql`
  query AuctionForAdminPage($id: String!) {
    getAuctionForAdminPage(id: $id) {
      title
      status
      startDate
      endDate
      timeZone
      startPrice
      currentPrice
      fairMarketValue
      auctionOrganizer {
        id
        name
      }
      charity {
        id
        name
        stripeAccountId
      }
      bids {
        user {
          id
          mongodbId
          phoneNumber
          status
          stripeCustomerId
          createdAt
        }
        bid
        paymentSource
        createdAt
      }
      isFailed
      isSold
    }
  }
`;

export const AuctionPriceLimitsQuery = gql`
  query auctionPriceLimits {
    auctionPriceLimits {
      max
      min
    }
  }
`;
export const GetTotalRaisedAmount = gql`
  query GetTotalRaisedAmount($influencerId: String, $charityId: String) {
    getTotalRaisedAmount(influencerId: $influencerId, charityId: $charityId) {
      totalRaisedAmount
    }
  }
`;
export const AuctionQuery = gql`
  query AuctionQuery($id: String!) {
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
      bids {
        user
        createdAt
        bid
        paymentSource
      }
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
    }
  }
`;

export const getAuctionBasics = gql`
  query getAuction($id: String!) {
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
      auctionOrganizer {
        id
      }
    }
  }
`;

export const GetAuctionMedia = gql`
  query getAuction($id: String!) {
    auction(id: $id) {
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

export const getAuctionDetails = gql`
  query getAuction($id: String!) {
    auction(id: $id) {
      id
      startDate
      endDate
      itemPrice
      startPrice
      link
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

export const chargeCurrentAuction = gql`
  mutation chargeCurrentAuction($id: String!) {
    chargeAuction(id: $id) {
      id
    }
  }
`;

export const chargeCurrendBid = gql`
  mutation chargeCurrendBid(
    $charityId: String!
    $charityStripeAccountId: String!
    $auctionTitle: String!
    $bid: Money!
    $paymentSource: String!
    $user: AuctionInputUser!
  ) {
    chargeCurrendBid(
      input: {
        charityId: $charityId
        charityStripeAccountId: $charityStripeAccountId
        auctionTitle: $auctionTitle
        bid: $bid
        paymentSource: $paymentSource
        user: $user
      }
    ) {
      id
    }
  }
`;

export const createAuctionMutation = gql`
  mutation createAuction(
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

export const MakeAuctionBidMutation = gql`
  mutation createAuctionBid($id: String!, $bid: Money!) {
    createAuctionBid(id: $id, bid: $bid) {
      id
      currentPrice
      totalBids
    }
  }
`;

export const updateAuctionBasics = gql`
  mutation updateAuction(
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

export const updateAuctionDetails = gql`
  mutation updateAuction(
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

export const AddAuctionMedia = gql`
  mutation addAuctionAttachment($id: String!, $file: Upload!, $organizerId: String) {
    addAuctionAttachment(id: $id, attachment: $file, organizerId: $organizerId) {
      url
      type
      cloudflareUrl
      thumbnail
      uid
      originalFileName
    }
  }
`;

export const RemoveAuctionMedia = gql`
  mutation removeAuctionAttachment($id: String!, $url: String!) {
    removeAuctionAttachment(id: $id, attachmentUrl: $url) {
      url
      type
      cloudflareUrl
      thumbnail
      uid
    }
  }
`;

export const AuctionsListQuery = gql`
  query auctions(
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
      }
    }
  }
`;
export const buyAuction = gql`
  mutation buyAuction($id: String!) {
    buyAuction(id: $id) {
      status
    }
  }
`;
export const stopAuction = gql`
  mutation stopAuction($id: String!) {
    stopAuction(id: $id) {
      status
    }
  }
`;
export const activateAuction = gql`
  mutation activateAuction($id: String!) {
    activateAuction(id: $id) {
      status
    }
  }
`;
export const finishAuctionCreationMutation = gql`
  mutation finishAuctionCreation($id: String!) {
    finishAuctionCreation(id: $id) {
      id
    }
  }
`;

export const SportsQuery = gql`
  query sports {
    sports
  }
`;
