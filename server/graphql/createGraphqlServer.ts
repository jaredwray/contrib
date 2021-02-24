import { ApolloError, ApolloServer, gql } from 'apollo-server-express';
import { Connection } from 'mongoose';

import { createGraphqlContext } from './createGraphqlContext';
import { UserAccountSchema, UserAccountResolvers } from '../app/UserAccount';
import { InfluencerResolvers, InfluencerSchema } from '../app/Influencer';
import { CharityResolvers, CharitySchema } from '../app/Charity';
import { AuctionResolvers, AuctionSchema } from '../app/Auction';
import { DateTimeResolver, DateTimeTypeDefs } from './scalars/dateTime';
import { MoneyResolver, MoneyTypeDefs } from './scalars/money';

import { AppLogger } from '../logger';
import { ErrorCode } from '../errors/ErrorCode';
import { AppError } from '../errors/AppError';
import { IAppServices } from '../app/AppServices';

export const DefaultSchema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export function createGraphqlServer(appServices: IAppServices): ApolloServer {
  return new ApolloServer({
    typeDefs: [
      DefaultSchema,
      DateTimeTypeDefs,
      MoneyTypeDefs,
      UserAccountSchema,
      InfluencerSchema,
      CharitySchema,
      AuctionSchema,
    ],
    resolvers: [
      DateTimeResolver,
      MoneyResolver,
      UserAccountResolvers,
      InfluencerResolvers,
      CharityResolvers,
      AuctionResolvers,
    ],
    context: (ctx) => createGraphqlContext(ctx, appServices),
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
