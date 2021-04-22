import { GraphqlHandler } from '../types';
import { AppError, ErrorCode } from '../../errors';
import { loadRole } from './loadRole';

export function requireRole<Result, Args, Parent>(
  handler: GraphqlHandler<Result, Args, Parent>,
): GraphqlHandler<Result, Args, Parent> {
  return loadRole(async (parent, args, context, info) => {
    if (info.path.typename === 'Mutation' && context.currentAccount.notAcceptedTerms) {
      throw new AppError('Forbidden', ErrorCode.FORBIDDEN);
    }

    if (context.currentAccount?.isAdmin || context.currentInfluencer || context.currentAssistant) {
      return handler(parent, args, context, info);
    }

    throw new AppError('Unauthorized', ErrorCode.UNAUTHORIZED);
  });
}
