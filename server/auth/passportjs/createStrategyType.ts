import passport from 'passport';

import { AppConfig } from '../../config';

type PassportStategyOptions = {
  clientID?: string;
  clientSecret?: string;
  consumerKey?: string;
  consumerSecret?: string;
  profileFields?: string[];
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
        if (!profile) return done({ message: 'Something whent wrong' }, null);

        const user = {
          id: `${type === 'google' ? 'google-oauth2' : type}|${profile.id}`,
          name: `${profile.name?.givenName} ${profile.name?.familyName}` || '',
          picture: profile.photos?.length ? profile.photos[0]?.value : '',
          email: profile.emails?.length ? profile.emails[0]?.value : '',
          phone_number: '',
        };
        done(null, user);
      },
    ),
  );
}
