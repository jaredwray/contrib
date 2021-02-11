export interface EnvironmentVariables {
  PORT: number;
  SERVE_CLIENT_APP: boolean;
  MONGODB_URI: string;
  // Auth0
  AUTH0_AUDIENCE: string;
  AUTH0_ISSUER_URL: string;
  AUTH0_MANAGEMENT_DOMAIN: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  // Twilio
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  VERIFICATION_SID: string;
}
