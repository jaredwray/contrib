import { GraphqlContext } from '../GraphqlContext';
import { AppError, ErrorCode } from '../../errors';
import { GraphqlHandler } from '../types';

export function requireAuthenticated<Result, Args>(
  handler: GraphqlHandler<Result, Args>,
): GraphqlHandler<Result, Args> {
  return (parent: unknown, args: Args, context: GraphqlContext, info: unknown): Promise<Result> => {
    if (!context.user) {
      throw new AppError('Unauthorized', ErrorCode.UNAUTHORIZED);
    }
    return handler(parent, args, context, info);
  };
}
