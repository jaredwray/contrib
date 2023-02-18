import { GraphqlHandler } from '../types';
import { loadAccount } from './loadAccount';

export function loadCharity<Result, Args, Parent>(
  handler: GraphqlHandler<Result, Args, Parent>,
): GraphqlHandler<Result, Args, Parent> {
  return loadAccount(async (parent, args, context, info) => {
    if (context.currentAccount?.mongodbId && context.currentCharity === undefined) {
      context.currentCharity = await context.charity.findCharityByUserAccount(context.currentAccount.mongodbId);
      context.currentCharityId = context.currentCharity?.id;
    }

    return handler(parent, args, context, info);
  });
}
