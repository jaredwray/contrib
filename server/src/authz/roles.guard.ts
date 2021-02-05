import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthUser } from './auth-user';

// For public queries - don't use this guard.
// If user should be restricted to access certain graphql quety then
// user should have Role in Auth0 which contains permission formatted like:
// `${ResolverClassName}:${QueryFunctionName}`, for example "AccountResolver:myAccount"
@Injectable()
export class RolesGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const requiredPermissionClaim = `${ctx.getClass().name}:${ctx.getHandler().name}`;
    const authUser: AuthUser = <AuthUser>ctx.getContext().req.user;
    return authUser.permissions.includes(requiredPermissionClaim);
  }
}
