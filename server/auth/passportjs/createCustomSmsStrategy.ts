import passport from 'passport';
import { Strategy as CustomStrategy } from 'passport-custom';

import { PhoneNumberVerificationService } from '../../app/PhoneNumberVerificationService';

export const createCustomSmsStrategy = (phoneNumberVerificationService: PhoneNumberVerificationService) => {
  passport.use(
    'sms',
    new CustomStrategy(async (req, done) => {
      try {
        const { phoneNumber, otp } = req.body;
        const verificationResult = await phoneNumberVerificationService.confirmVerification(phoneNumber, otp);

        if (!verificationResult) return done({ message: 'Incorrect verification code' }, null);

        const user = {
          id: `sms|${phoneNumber.replace('+', '')}`,
          name: phoneNumber || '',
          picture: '',
          email: '',
          phone_number: phoneNumber,
        };
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }),
  );
};
