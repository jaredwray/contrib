export const AppConfig = {
  app: {
    port: Number(process.env.PORT ?? 3000),
    url: requireEnvVar('APP_URL'),
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
    bucketName: requireEnvVar('GOOGLE_CLOUD_BUCKET_NAME_FOR_PICTURES')
  }
};

function requireEnvVar(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`missing required env variable: ${name}`);
  }
  return value;
}
