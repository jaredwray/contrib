export class AuthUser {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  azp: string;
  gty?: string;
  scope?: string;
}
