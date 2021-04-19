import { gql } from 'apollo-server-express';

export const TermsSchema = gql`
  type TermsInput {
    version: String!
    date: String!
  }

  type TermsList {
    userAccount: TermsInput
    assistant: TermsInput
    influencer: TermsInput
  }

  extend type Query {
    terms: TermsList
  }
`;
