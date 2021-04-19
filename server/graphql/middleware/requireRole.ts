import { GraphqlHandler } from '../types';
import { AppError, ErrorCode } from '../../errors';
import { loadRole } from './loadRole';

export function requireRole<Result, Args, Parent>(
  handler: GraphqlHandler<Result, Args, Parent>,
): GraphqlHandler<Result, Args, Parent> {
  return loadRole(async (parent, args, context, info) => {
    if (
      info.path.typename == 'Mutation' &&
      !['acceptAccountTerms', 'acceptInfluencerTerms', 'acceptAssistantTerms'].includes(info.fieldName) &&
      (context.currentAccount.notAcceptedTerms ||
        context.currentInfluencer?.notAcceptedTerms ||
        context.currentAssistant?.notAcceptedTerms)
    ) {
      throw new AppError('Forbidden', ErrorCode.FORBIDDEN);
    }

    if (context.currentAccount?.isAdmin || context.currentInfluencer || context.currentAssistant) {
      return handler(parent, args, context, info);
    }

    throw new AppError('Unauthorized', ErrorCode.UNAUTHORIZED);
  });
}
