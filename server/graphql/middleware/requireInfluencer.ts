import { GraphqlHandler } from '../types';
import { AppError, ErrorCode } from '../../errors';
import { loadInfluencer } from './loadInfluencer';

export function requireInfluencer<Result, Args>(handler: GraphqlHandler<Result, Args>): GraphqlHandler<Result, Args> {
  return loadInfluencer(async (parent, args, context, info) => {
    if (!context.currentInfluencer) {
      throw new AppError('Unauthorized', ErrorCode.UNAUTHORIZED);
    }
    return handler(parent, args, context, info);
  });
}
