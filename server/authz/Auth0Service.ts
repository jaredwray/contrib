import { ManagementClient, Role } from 'auth0';
import { GetPublicKeyOrSecret, JwtHeader, SigningKeyCallback, verify as verifyJwt, VerifyErrors } from 'jsonwebtoken';
import * as JwksClient from 'jwks-rsa';

import { Auth0User } from './Auth0User';
import { Auth0TokenPayload } from './Auth0TokenPayload';
import { UserRole } from './UserRole';
import { AppConfig } from '../config';
import { AppLogger } from '../logger';

export class Auth0Service {
  private readonly jwksClient: JwksClient.JwksClient;
  private readonly managementClient = new ManagementClient({
    domain: AppConfig.auth0.management.domain,
    clientId: AppConfig.auth0.management.clientId,
    clientSecret: AppConfig.auth0.management.clientSecret,
  });

  constructor() {
    this.jwksClient = JwksClient({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${AppConfig.auth0.issuerUrl}.well-known/jwks.json`,
    });
  }

  async getUserFromBearerToken(token: string): Promise<Auth0User | null> {
    if (!token) {
      return null;
    }

    return new Promise((resolve) => {
      const options = {
        audience: AppConfig.auth0.audience,
        issuer: AppConfig.auth0.issuerUrl,
        algorithms: ['RS256'],
      };

      verifyJwt(token, this.getKey, options, (error: VerifyErrors, payload: Auth0TokenPayload): void => {
        if (error) {
          AppLogger.warn(`error resolving auth0 token`, error);
          resolve(null);
        } else {
          resolve(new Auth0User(payload));
        }
      });
    });
  }

  async assignUserRole(authzId: string, role: UserRole): Promise<void> {
    const roles = await this.listRoles();
    const roleIds: string[] = roles.filter((authzRole) => authzRole.name === role).map((authzRole) => authzRole.id);
    if (!roleIds?.length) {
      throw new Error(
        `failed adding roles to user: no roles match ${role} in auth0; all roles: ${JSON.stringify(roles)}`,
      );
    }
    return this.managementClient.assignRolestoUser({ id: authzId }, { roles: roleIds });
  }

  private async listRoles(): Promise<Role[]> {
    return this.managementClient.getRoles();
  }

  private getKey = (header: JwtHeader, cb: SigningKeyCallback): GetPublicKeyOrSecret => {
    this.jwksClient.getSigningKey(header.kid, (err: Error, key: JwksClient.SigningKey) => {
      const signingKey = key.getPublicKey();
      cb(null, signingKey);
    });
  };
}
