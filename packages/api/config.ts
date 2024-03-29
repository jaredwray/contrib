import { config as loadDotEnvFile } from 'dotenv';
import fs from 'fs-extra';

if (fs.pathExistsSync(`./.env`)) loadDotEnvFile();

export const requireEnvVar = (name: string): string => {
  const value = process.env[name];
  if (value) return value;

  throw new Error(`missing required env variable: ${name}`);
};

const appUrl = new URL(requireEnvVar('APP_URL').replace(/\/$/, ''));

export const AppConfig = Object.freeze({
  app: {
    port: Number(process.env.PORT ?? 3000),
    url: appUrl,
    defaultCurrency: 'USD',
    contactEmail: 'help@contrib.org',
    defaultAvatar: '/content/img/users/person-circle.svg',
  },
  environment: {
    isProduction: process.env.NODE_ENV === 'live',
    isDev: process.env.NODE_ENV === 'dev',
    isLocal: process.env.NODE_ENV === 'local' || ['localhost', '127.0.0.1'].includes(appUrl.hostname),
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
  auth: {
    apiUrl: requireEnvVar('AUTH_API_URL').replace(/\/$/, ''),
    google: {
      clientId: requireEnvVar('GOOGLE_CLIENT_ID'),
      clientSecret: requireEnvVar('GOOGLE_CLIENT_SECRET'),
    },
    facebook: {
      clientId: requireEnvVar('FACEBOOK_APP_ID'),
      clientSecret: requireEnvVar('FACEBOOK_APP_SECRET'),
    },
    twitter: {
      consumerKey: requireEnvVar('TWITTER_CONSUMER_KEY'),
      consumerSecret: requireEnvVar('TWITTER_CONSUMER_SECRET'),
    },
    cookies: {
      cookiesSecret: requireEnvVar('COOKIE_KEY_SECRET'),
      cookiesLiveTime: requireEnvVar('COOKIE_LIFE_TIME_MINS') ?? 1440, // 24 hours in minutes
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
    minBidValue: 10,
    maxPriceValue: 999999,
  },
  delivery: {
    UPSSimpleRateType: 'M', // Delivery type, Valid Values: XS = 1-100 in3 S = 101-250 in3 M = 251-650 in3 L = 651-1,050 in3 XL = 1,051-1,728 in3
    UPSContribDeliveryData: JSON.parse(requireEnvVar('UPS_DELIVERY_CONTRIB_DATA')),
    UPSRequestHeader: JSON.parse(requireEnvVar('UPS_DELIVERY_REQUEST_HEADER')),
    UPSTestEnviroment: (process.env['UPS_TEST_ENVIROMENT'] || 'true') === 'true',
    UPSSMSWithDeliveryLink: (process.env['UPS_SMS_WITH_DELIVERY_LINK'] || 'false') === 'true',
  },
});
