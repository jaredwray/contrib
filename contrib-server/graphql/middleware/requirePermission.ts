import { UserPermission } from '../../authz/UserPermission';
import { GraphqlContext } from '../GraphqlContext';
import { AppError } from '../../errors/AppError';
import { ErrorCode } from '../../errors/ErrorCode';

export function requirePermission<Result, Args>(
  permission: UserPermission,
  handler: (parent: unknown, args: Args, context: GraphqlContext, info: unknown) => Promise<Result>,
) {
  return async (parent: unknown, args: Args, context: GraphqlContext, info: unknown) => {
    if (!context.user?.hasPermission(permission)) {
      throw new AppError('Unauthorized', ErrorCode.UNAUTHORIZED);
    }
    return await handler(parent, args, context, info);
  };
}
