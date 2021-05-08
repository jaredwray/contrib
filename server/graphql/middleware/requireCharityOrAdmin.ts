import { GraphqlHandler } from '../types';
import { AppError, ErrorCode } from '../../errors';
import { loadCharity } from './loadCharity';

export function requireCharityOrAdmin<Result, Args, Parent>(
  handler: GraphqlHandler<Result, Args, Parent>,
): GraphqlHandler<Result, Args, Parent> {
  return loadCharity(async (parent, args, context, info) => {
    if (context.currentAccount?.isAdmin || context.currentCharity) {
      return handler(parent, args, context, info);
    }
    throw new AppError('Unauthorized', ErrorCode.UNAUTHORIZED);
  });
}
