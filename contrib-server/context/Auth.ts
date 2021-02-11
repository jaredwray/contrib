import { GetPublicKeyOrSecret, JwtHeader, SigningKeyCallback, VerifyOptions, VerifyErrors, verify } from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { Request } from 'express';
import { AuthUser } from '../dto/AuthUser';
import { AuthenticationError } from 'apollo-server';

const client: jwksClient.JwksClient = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
});

const getKey: GetPublicKeyOrSecret = (header: JwtHeader, cb: SigningKeyCallback) => {
  client.getSigningKey(header.kid, function (err: Error, key: jwksClient.SigningKey) {
    const signingKey = key.getPublicKey();
    cb(null, signingKey);
  });
};

const options: VerifyOptions = {
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER_URL,
  algorithms: ['RS256'],
};

export const fetchAuthUser = async (req: Request): Promise<AuthUser> => {
  const auth: string = req.headers.authorization;
  const token: string = auth.split(' ')[1] || '';

  const res: Promise<AuthUser> = new Promise((resolve, reject) => {
    verify(token, getKey, options, (err: VerifyErrors, decoded: any): void => {
      if (err) {
        // make work playground web UI
        console.log(`request method: ${req.method}`);
        if (req.method == 'GET') {
          resolve(<AuthUser>{ sub: 'playground', permissions: [] });
        } else {
          reject(new AuthenticationError('Your session expired. Sign in again.'));
        }
      } else {
        console.log(decoded);
        const user: AuthUser = <AuthUser>decoded;
        resolve(user);
      }
    });
  });
  return res;
};
