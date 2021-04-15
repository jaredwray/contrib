import { config as loadDotEnvFile } from 'dotenv';
import fs from 'fs-extra';

if (fs.pathExistsSync(`./.env`)) {
  loadDotEnvFile();
}

export const requireEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`missing required env variable: ${name}`);
  }
  return value;
};

export const AppConfig = {
  app: {
    port: Number(process.env.PORT ?? 3000),
    url: requireEnvVar('APP_URL').replace(/\/$/, ''),
  },
  environment: {
    isProduction: process.env.NODE_ENV === 'live',
    isDev: process.env.NODE_ENV === 'dev',
    isLocal: process.env.NODE_ENV === 'local',
    serveClient: Boolean(process.env.SERVE_CLIENT || process.env.NODE_ENV !== 'local'),
  },
  newRelic: {
    appName: process.env.NEW_RELIC_APP_NAME,
    licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
    enabled: Boolean(process.env.NEW_RELIC_APP_NAME && process.env.NEW_RELIC_LICENSE_KEY),
  },
  mongodb: {
    uri: requireEnvVar('MONGODB_URI'),
  },
  auth0: {
    issuerUrl: requireEnvVar('AUTH0_ISSUER_URL'),
    audience: requireEnvVar('AUTH0_AUDIENCE'),
    management: {
      domain: requireEnvVar('AUTH0_MANAGEMENT_DOMAIN'),
      clientId: requireEnvVar('AUTH0_MANAGEMENT_CLIENT_ID'),
      clientSecret: requireEnvVar('AUTH0_MANAGEMENT_CLIENT_SECRET'),
    },
  },
  twilio: {
    accountSid: requireEnvVar('TWILIO_ACCOUNT_SID'),
    authToken: requireEnvVar('TWILIO_AUTH_TOKEN'),
    senderNumber: requireEnvVar('TWILIO_SENDER_NUMBER'),
    verificationService: {
      sid: requireEnvVar('TWILIO_VERIFICATION_SERVICE_SID'),
    },
  },
  googleCloud: {
    bucketName: requireEnvVar('CONTENT_STORAGE_NAME'),
    keyDump: requireEnvVar('CONTENT_STORAGE_KEY'),
    schedulerSecretKey: requireEnvVar('AUCTION_SCHEDULER_SECRET'),
  },
  cloudflare: {
    token: requireEnvVar('CLOUDFLARE_STREAMING_KEY'),
    user: requireEnvVar('CLOUDFLARE_USER_ID'),
  },
  bitly: {
    accessToken: requireEnvVar('BITLY_ACCESS_TOKEN'),
    domain: requireEnvVar('BITLY_DOMAIN'),
  },
  stripe: {
    secretKey: requireEnvVar('STRIPE_SECRET_KEY'),
  },
  facebook: {
    appId: requireEnvVar('FACEBOOK_APP_ID'),
  },
};
