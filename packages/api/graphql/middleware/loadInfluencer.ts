import { GraphqlHandler } from '../types';
import { loadAccount } from './loadAccount';

export function loadInfluencer<Result, Args, Parent>(
  handler: GraphqlHandler<Result, Args, Parent>,
): GraphqlHandler<Result, Args, Parent> {
  return loadAccount(async (parent, args, context, info) => {
    if (context.currentAccount?.mongodbId && context.currentInfluencer === undefined) {
      context.currentInfluencer = await context.influencerService.find({
        userAccount: context.currentAccount.mongodbId,
      });
    }

    return handler(parent, args, context, info);
  });
}
