import { GraphqlHandler } from '../types';
import { AppError, ErrorCode } from '../../errors';
import { loadAccount } from './loadAccount';

export function requireAdmin<Result, Args>(handler: GraphqlHandler<Result, Args>): GraphqlHandler<Result, Args> {
  return loadAccount(async (parent, args, context, info) => {
    if (!context.currentAccount?.isAdmin) {
      throw new AppError('Unauthorized', ErrorCode.UNAUTHORIZED);
    }
    return handler(parent, args, context, info);
  });
}
