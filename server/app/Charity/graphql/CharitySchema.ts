import { gql } from 'apollo-server-express';

export const CharitySchema = gql`
  type Charity {
    id: String!
    name: String!
  }

  input CharityInput {
    name: String!
  }

  type CharitiesPage {
    items: [Charity]!
    totalItems: Int!
    size: Int!
    skip: Int!
  }

  extend type Query {
    searchForCharities(inpit: CharityInput!): [Charity]!
    charities(size: Int!, skip: Int!): CharitiesPage!
  }

  extend type Mutation {
    createCharity(input: CharityInput!): Charity!
    updateCharity(id: String!, input: CharityInput!): Charity!
  }
`;
