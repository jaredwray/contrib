import { GraphqlHandler } from '../types';
import { loadAccount } from './loadAccount';

export function loadInfluencer<Result, Args>(handler: GraphqlHandler<Result, Args>): GraphqlHandler<Result, Args> {
  return loadAccount(async (parent, args, context, info) => {
    if (context.currentAccount?.mongodbId && context.currentInfluencer === undefined) {
      context.currentInfluencer = await context.influencer.findInfluencerByUserAccount(
        context.currentAccount.mongodbId,
      );
    }
    return handler(parent, args, context, info);
  });
}
