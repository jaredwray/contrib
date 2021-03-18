import { Auth0TokenPayload } from './Auth0TokenPayload';

export class Auth0User {
  constructor(private readonly tokenPayload: Auth0TokenPayload) {}

  get id(): string {
    return this.tokenPayload.sub;
  }
}
