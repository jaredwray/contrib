import { GraphqlContext } from '../GraphqlContext';
import { AppError } from '../../errors/AppError';
import { ErrorCode } from '../../errors/ErrorCode';

export function requireAuthenticated<Result, Args>(
  handler: (parent: unknown, args: Args, context: GraphqlContext, info: unknown) => Promise<Result>,
) {
  return async (parent: unknown, args: Args, context: GraphqlContext, info: unknown): Promise<Result> => {
    if (!context.user) {
      throw new AppError('Unauthorized', ErrorCode.UNAUTHORIZED);
    }
    return await handler(parent, args, context, info);
  };
}
