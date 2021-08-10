import { ApolloError, ApolloServer, gql } from 'apollo-server-express';
import { subscribe } from 'graphql/subscription';
import { execute } from 'graphql/execution';
import { GraphQLUpload } from 'graphql-upload';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { Server } from 'http';

import { createGraphqlContext } from './createGraphqlContext';
import { UserAccountResolvers, UserAccountSchema } from '../app/UserAccount';
import { AssistantResolvers, AssistantSchema } from '../app/Assistant';
import { InvitationResolvers, InvitationSchema } from '../app/Invitation';
import { InfluencerResolvers, InfluencerSchema } from '../app/Influencer';
import { CharityResolvers, CharitySchema } from '../app/Charity';
import { AuctionResolvers, AuctionSchema } from '../app/Auction';
import { BidResolvers, BidSchema } from '../app/Bid';
import { DateTimeResolver, DateTimeTypeDefs } from './scalars/dateTime';
import { MoneyResolver, MoneyTypeDefs } from './scalars/money';

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

  type Subscription {
    _empty: String
  }

  scalar Upload
`;

const schema = makeExecutableSchema({
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
    BidSchema,
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
    BidResolvers,
    PaymentResolvers,
    {
      Upload: GraphQLUpload,
    },
  ],
});

export function createGraphqlServer(appServices: IAppServices, httpServer: Server): ApolloServer {
  const apolloServer = new ApolloServer({
    // don't use bundled file uploading capabilities, use graphql-upload package instead
    uploads: false,
    schema,
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

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: apolloServer.graphqlPath,
    },
  );
  // Shut down in the case of interrupt and termination signals
  // We expect to handle this more cleanly in the future. See (#5074)[https://github.com/apollographql/apollo-server/issues/5074] for reference.
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => subscriptionServer.close());
  });

  return apolloServer;
}
