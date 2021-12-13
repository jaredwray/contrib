import { gql } from 'apollo-server-express';

/**
 * @description holds user account schema
 */

export const UserAccountSchema = gql`
  """
  The supported user account statuses.
  """
  enum UserAccountStatus {
    """
    Account have verified phone number.
    """
    COMPLETED

    """
    Account provided with a phone but not confirmed.
    """
    PHONE_NUMBER_CONFIRMATION_REQUIRED

    """
    Account have no attached phone number.
    """
    PHONE_NUMBER_REQUIRED
  }

  type UserAccountForBid {
    id: String!
    createdAt: String!
    phoneNumber: String!
    stripeCustomerId: String!
  }

  type UserAccountAddress {
    name: String
    state: String
    city: String
    zipCode: String
    country: String
    street: String
    phoneNumber: String
  }

  type UserAccount {
    """
    ID is the user_id received from PassportJs.
    """
    id: String!
    mongodbId: String
    """
    Account verified phone number.
    """
    phoneNumber: String

    """
    Account onboarding status.
    """
    status: UserAccountStatus!

    """
    Admin users will have True here, others will have null.
    """
    isAdmin: Boolean

    """
    User creation datetime
    """
    createdAt: String
    stripeCustomerId: String
    notAcceptedTerms: String
    address: UserAccountAddress
  }

  input UserAccountAddressInput {
    name: String!
    state: String!
    city: String!
    zipCode: String!
    street: String!
    phoneNumber: String!
  }

  extend type Query {
    myAccount: UserAccount!
    getAccountById(id: String!): UserAccountForBid!
  }

  type PhoneNumber {
    phoneNumber: String
  }

  extend type Mutation {
    acceptAccountTerms(version: String!): UserAccount!
    createAccountWithPhoneNumber(phoneNumber: String): UserAccount!
    verifyChangePhoneNumber(phoneNumber: String): PhoneNumber
    confirmAccountWithPhoneNumber(phoneNumber: String!, otp: String!): UserAccount!
    confirmChangePhoneNumber(phoneNumber: String, otp: String): PhoneNumber
    createOrUpdateUserAddress(auctionId: String!, userId: String, input: UserAccountAddressInput!): UserAccountAddress!
    updateCreditCard(stripeCustomerId: String!): UserAccount!
  }
`;
