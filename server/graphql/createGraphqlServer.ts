import { ApolloError, ApolloServer, gql } from 'apollo-server-express';

import { createGraphqlContext } from './createGraphqlContext';
import { UserAccountResolvers, UserAccountSchema } from '../app/UserAccount';
import { AssistantResolvers, AssistantSchema } from '../app/Assistant';
import { InvitationResolvers, InvitationSchema } from '../app/Invitation';
import { InfluencerResolvers, InfluencerSchema } from '../app/Influencer';
import { CharityResolvers, CharitySchema } from '../app/Charity';
import { AuctionResolvers, AuctionSchema } from '../app/Auction';
import { DateTimeResolver, DateTimeTypeDefs } from './scalars/dateTime';
import { MoneyResolver, MoneyTypeDefs } from './scalars/money';
import { GraphQLUpload } from 'graphql-upload';

import { AppLogger } from '../logger';
import { AppError, ErrorCode } from '../errors';
import { IAppServices } from '../app/AppServices';
import { PaymentResolvers, PaymentSchema } from '../app/Payment';

export const DefaultSchema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  scalar Upload
`;

export function createGraphqlServer(appServices: IAppServices): ApolloServer {
  return new ApolloServer({
    // don't use bundled file uploading capabilities, use graphql-upload package instead
    uploads: false,
    typeDefs: [
      DefaultSchema,
      DateTimeTypeDefs,
      MoneyTypeDefs,
      UserAccountSchema,
      InfluencerSchema,
      InvitationSchema,
      AssistantSchema,
      CharitySchema,
      AuctionSchema,
      PaymentSchema,
    ],
    resolvers: [
      DateTimeResolver,
      MoneyResolver,
      UserAccountResolvers,
      InfluencerResolvers,
      InvitationResolvers,
      AssistantResolvers,
      CharityResolvers,
      AuctionResolvers,
      PaymentResolvers,
      {
        Upload: GraphQLUpload,
      },
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
        throw new ApolloError(`${originalError.message}`, ErrorCode.INTERNAL_ERROR);
      }

      AppLogger.error(`unhandled graphql failure: ${JSON.stringify(error)}`);
      throw new ApolloError('Something went wrong. Please try again later.', ErrorCode.INTERNAL_ERROR);
    },
  });
}
