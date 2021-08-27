import { gql } from '@apollo/client';

export const MyAccountQuery = gql`
  query GetMyAccount {
    myAccount {
      id
      mongodbId
      phoneNumber
      status
      isAdmin
      createdAt
      notAcceptedTerms
      charity {
        id
        name
        status
        profileStatus
        stripeStatus
        stripeAccountLink
      }
      influencerProfile {
        id
        profileDescription
        name
        sport
        team
        avatarUrl
        status
      }
      assistant {
        name
        status
        influencerId
      }
      paymentInformation {
        id
        cardNumberLast4
        cardBrand
        cardExpirationMonth
        cardExpirationYear
      }
      address {
        name
        state
        city
        zipCode
        country
        street
      }
    }
  }
`;

export const getAccountById = gql`
  query getAccountById($id: String!) {
    getAccountById(id: $id) {
      id
      createdAt
      phoneNumber
      stripeCustomerId
    }
  }
`;

export const CreateOrUpdateUserAddressMutation = gql`
  mutation CreateOrUpdateUserAddress(
    $auctionId: String!
    $name: String!
    $state: String!
    $city: String!
    $zipCode: String!
    $street: String!
    $phoneNumber: String!
  ) {
    createOrUpdateUserAddress(
      auctionId: $auctionId
      input: { state: $state, city: $city, zipCode: $zipCode, street: $street, name: $name, phoneNumber: $phoneNumber }
    ) {
      state
      city
      zipCode
      street
      phoneNumber
    }
  }
`;
