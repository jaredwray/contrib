import { gql } from 'apollo-server-express';

export const ShortLinkSchema = gql`
  type Link {
    id: String!
    link: String!
    slug: String!
  }

  extend type Query {
    getLink(slug: String): Link
  }
`;
