import passport from 'passport';

import { Strategy as GoogleAuthStategy } from 'passport-google-oauth20';
import { Strategy as FacebookAuthStategy } from 'passport-facebook';
import { Strategy as TwitterAuthStategy } from 'passport-twitter';

import { PhoneNumberVerificationService } from '../../app/PhoneNumberVerificationService';

import { createStrategyType } from './createStrategyType';
import { createCustomSmsStrategy } from './createCustomSmsStrategy';

import { AppConfig } from '../../config';

export const createPassportStrategies = (phoneNumberVerificationService: PhoneNumberVerificationService) => {
  const facebookStrategyData = {
    type: 'facebook',
    options: {
      clientID: AppConfig.auth.facebook.clientId,
      clientSecret: AppConfig.auth.facebook.clientSecret,
      profileFields: ['id', 'first_name', 'last_name', 'photos', 'email'],
    },
    strategy: FacebookAuthStategy,
  };

  createStrategyType(facebookStrategyData);

  const googleStrategyData = {
    type: 'google',
    options: {
      clientID: AppConfig.auth.google.clientId,
      clientSecret: AppConfig.auth.google.clientSecret,
    },
    strategy: GoogleAuthStategy,
  };

  createStrategyType(googleStrategyData);

  const twitterStrategyData = {
    type: 'twitter',
    options: {
      consumerKey: AppConfig.auth.twitter.consumerKey,
      consumerSecret: AppConfig.auth.twitter.consumerSecret,
    },
    strategy: TwitterAuthStategy,
  };

  createStrategyType(twitterStrategyData);

  createCustomSmsStrategy(phoneNumberVerificationService);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    if (user) {
      done(null, user);
    }
  });
};
