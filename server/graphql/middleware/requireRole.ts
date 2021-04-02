import { GraphqlHandler } from '../types';
import { AppError, ErrorCode } from '../../errors';
import { loadInfluencer } from './loadInfluencer';

export function requireRole<Result, Args, Parent>(
  handler: GraphqlHandler<Result, Args, Parent>,
): GraphqlHandler<Result, Args, Parent> {
  return loadInfluencer(async (parent, args, context, info) => {
    if (!context.currentAccount?.isAdmin && !context.currentInfluencer) {
      throw new AppError('Unauthorized', ErrorCode.UNAUTHORIZED);
    }
    return handler(parent, args, context, info);
  });
}
