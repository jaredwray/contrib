import passport from 'passport';

import { AppConfig } from '../../config';

type PassportStategyOptions = {
  clientID?: string;
  clientSecret?: string;
  consumerKey?: string;
  consumerSecret?: string;
};

type PassportStategyData = {
  type: string;
  strategy: any;
  options: PassportStategyOptions;
};

export function createStrategyType({ type, strategy, options }: PassportStategyData) {
  const CALLBACK_URL = `${AppConfig.auth.apiUrl}/api/v1/auth/${type}/callback`;

  passport.use(
    new strategy(
      {
        ...options,
        callbackURL: CALLBACK_URL,
      },
      (_, __, profile, done) => {
        if (profile) {
          const user = {
            id: `google-oauth2|${profile?.id}`,
            name: `${profile?.name?.givenName} ${profile?.name?.familyName}` || '',
            picture: profile?.photos[0]?.value || '',
            email: profile?.emails[0]?.value || '',
            phone_number: '',
          };
          done(null, user);
        }
      },
    ),
  );
}
