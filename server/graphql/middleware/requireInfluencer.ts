import { GraphqlHandler } from '../types';
import { AppError, ErrorCode } from '../../errors';
import { loadInfluencer } from './loadInfluencer';

export function requireInfluencer<Result, Args, Parent>(
  handler: GraphqlHandler<Result, Args, Parent>,
): GraphqlHandler<Result, Args, Parent> {
  return loadInfluencer(async (parent, args, context, info) => {
    if (
      info.path.typename == 'Mutation' &&
      !['acceptAccountTerms', 'acceptInfluencerTerms'].includes(info.fieldName) &&
      (context.currentAccount.notAcceptedTerms || context.currentInfluencer?.notAcceptedTerms)
    ) {
      throw new AppError('Forbidden', ErrorCode.FORBIDDEN);
    }

    if (!context.currentInfluencer) {
      throw new AppError('Unauthorized', ErrorCode.UNAUTHORIZED);
    }

    return handler(parent, args, context, info);
  });
}
