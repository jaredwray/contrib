import { ApolloError, ApolloServer, gql } from 'apollo-server';

import { createGraphqlContext } from './createGraphqlContext';
import { UserAccountSchema, UserAccountResolvers } from '../app/UserAccount';
import { AppLogger } from '../logger';
import { ErrorCode } from '../errors/ErrorCode';
import { AppError } from '../errors/AppError';
import { InfluencerResolvers, InfluencerSchema } from '../app/Influencer';

export const DefaultSchema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export function createGraphqlServer() {
  return new ApolloServer({
    typeDefs: [DefaultSchema, UserAccountSchema, InfluencerSchema],
    resolvers: [UserAccountResolvers, InfluencerResolvers],
    context: createGraphqlContext,
    playground: {
      endpoint: '/graphql',
    },
    introspection: true,
    formatError: (error) => {
      const originalError = error.originalError;

      if (originalError instanceof AppError) {
        AppLogger.debug(
          `handling exception "${originalError.name}" (${originalError.code}): ${originalError.message}`,
          { stack: originalError.stack },
        );
        throw new ApolloError(originalError.message, originalError.code);
      }

      if (originalError) {
        AppLogger.error(`unhandled exception "${originalError.name}": ${originalError.message}`, {
          stack: originalError.stack,
        });
        throw new ApolloError('Something went wrong. Please try again later.', ErrorCode.INTERNAL_ERROR);
      }

      AppLogger.error(`unhandled graphql failure: ${JSON.stringify(error)}`);
      throw new ApolloError('Something went wrong. Please try again later.', ErrorCode.INTERNAL_ERROR);
    },
  });
}
