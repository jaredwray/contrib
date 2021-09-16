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
    defaultCurrency: 'USD',
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
    task: {
      googleProjectId: requireEnvVar('GOOGLE_CLOUD_PROJECT'),
      location: requireEnvVar('GOOGLE_CLOUD_LOCATION'),
      queue: requireEnvVar('GOOGLE_CLOUD_TASK_QUEUE'),
      googleTaskApiToken: requireEnvVar('GOOGLE_CLOUD_TASK_API_TOKEN'),
      notificationTaskTargetURL: requireEnvVar('NOTIFICATION_TASK_TARGET_URL'),
    },
    auctionEndsTime: {
      firstNotification: 61, // 1 min takes to generate it and send from the task
      lastNotification: 6, // 1 min takes to generate it and send from the task
      notificationForAuctionOrganizer: 1441, // 24hours + 1 min takes to generate it and send from the task
    },
  },
  cloudflare: {
    token: requireEnvVar('CLOUDFLARE_STREAMING_KEY'),
    user: requireEnvVar('CLOUDFLARE_USER_ID'),
    maxSizeGB: process.env['MAX_SIZE_VIDEO_GB'],
  },
  bitly: {
    accessToken: requireEnvVar('BITLY_ACCESS_TOKEN'),
    domain: requireEnvVar('BITLY_DOMAIN'),
  },
  stripe: {
    stripeFee: {
      fixedFee: 0.3,
      percentFee: 2.9 / 100,
    }, // constants for calculation stripe fee and including it to charge, relevant information on stripe fee constants can be found here: https://stripe.com/pricing#pricing-details
    secretKey: requireEnvVar('STRIPE_SECRET_KEY'),
    webhookSecretKey: requireEnvVar('STRIPE_WEBHOOK_SECRET_KEY'),
    contribSharePercentage: requireEnvVar('STRIPE_CONTRIB_SHARE_PERCENTAGE'),
  },
  facebook: {
    appId: requireEnvVar('FACEBOOK_APP_ID'),
  },
  terms: {
    version: '1.0',
  },
  bid: {
    maxBidSize: 99999999,
  },
  delivery: {
    UPSContribDeliveryData: JSON.parse(requireEnvVar('UPS_DELIVERY_CONTRIB_DATA')),
    UPSContribCardData: JSON.parse(process.env['UPS_CONTRIB_CARD_DATA'] || '{}'),
    UPSRequestHeader: JSON.parse(requireEnvVar('UPS_DELIVERY_REQUEST_HEADER')),
    UPSAuctionDefaultParcelParameters: requireEnvVar('UPS_AUCTION_DEFAULT_PARCEL_PARAMETERS'),
    UPSTestEnviroment: (process.env['UPS_TEST_ENVIROMENT'] || 'true') === 'true',
    UPSSMSWithDeliveryLink: (process.env['UPS_SMS_WITH_DELIVERY_LINK'] || 'false') === 'true',
  },
};
