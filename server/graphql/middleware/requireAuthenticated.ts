import { GraphqlContext } from '../GraphqlContext';
import { AppError, ErrorCode } from '../../errors';
import { GraphqlHandler } from '../types';
import { loadAccount } from './loadAccount';

export function requireAuthenticated<Result, Args, Parent>(
  handler: GraphqlHandler<Result, Args, Parent>,
): GraphqlHandler<Result, Args, Parent> {
  return loadAccount(
    (parent: Parent, args: Args, context: GraphqlContext, info): Promise<Result> => {
      if (!context.user) {
        throw new AppError('Unauthorized', ErrorCode.UNAUTHORIZED);
      }
      return handler(parent, args, context, info);
    },
  );
}
