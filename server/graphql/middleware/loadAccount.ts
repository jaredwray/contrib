import { GraphqlHandler } from '../types';

export function loadAccount<Result, Args>(handler: GraphqlHandler<Result, Args>): GraphqlHandler<Result, Args> {
  return async (parent, args, context, info) => {
    if (context.user && context.currentAccount === undefined) {
      context.currentAccount = await context.userAccount.getAccountByAuthzId(context.user.id);
    }
    return handler(parent, args, context, info);
  };
}
