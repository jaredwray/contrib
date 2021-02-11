// start getting roles under
// 'http://localhost:3001/roles': [ 'plain_user' ],
export interface AuthUser {
  iss?: string;
  sub: string;
  aud?: string;
  iat?: number;
  exp?: number;
  azp?: string;
  gty?: string;
  scope?: string;
  permissions: string[];
}
