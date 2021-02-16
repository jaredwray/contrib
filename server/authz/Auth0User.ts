import { Auth0TokenPayload } from './Auth0TokenPayload';
import { UserPermission } from './UserPermission';

export class Auth0User {
  constructor(private readonly tokenPayload: Auth0TokenPayload) {}

  get id(): string {
    return this.tokenPayload.sub;
  }

  hasPermission(permission: UserPermission): boolean {
    return Boolean(this.tokenPayload.permissions?.includes(permission));
  }
}
