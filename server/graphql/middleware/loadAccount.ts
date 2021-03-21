import { GraphqlHandler } from '../types';

export function loadAccount<Result, Args, Parent>(
  handler: GraphqlHandler<Result, Args, Parent>,
): GraphqlHandler<Result, Args, Parent> {
  return async (parent, args, context, info) => {
    if (context.user && context.currentAccount === undefined) {
      context.currentAccount = await context.userAccount.getAccountByAuthzId(context.user.id);
    }
    return handler(parent, args, context, info);
  };
}
