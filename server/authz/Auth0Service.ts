import { ManagementClient } from 'auth0';
import { GetPublicKeyOrSecret, JwtHeader, SigningKeyCallback, verify as verifyJwt, VerifyErrors } from 'jsonwebtoken';
import * as JwksClient from 'jwks-rsa';

import { Auth0User } from './Auth0User';
import { Auth0TokenPayload } from './Auth0TokenPayload';
import { AppConfig } from '../config';
import { AppLogger } from '../logger';

export class Auth0Service {
  private readonly jwksClient: JwksClient.JwksClient;

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

  private getKey = (header: JwtHeader, cb: SigningKeyCallback): GetPublicKeyOrSecret => {
    this.jwksClient.getSigningKey(header.kid, (err: Error, key: JwksClient.SigningKey) => {
      const signingKey = key.getPublicKey();
      cb(null, signingKey);
    });
  };
}
