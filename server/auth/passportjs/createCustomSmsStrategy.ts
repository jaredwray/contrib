import passport from 'passport';
import { Strategy as CustomStrategy } from 'passport-custom';

import { TwilioVerificationService } from '../../twilio-client';

export const createCustomSmsStrategy = (twilioService: TwilioVerificationService) => {
  passport.use(
    'sms',
    new CustomStrategy(async (req, done) => {
      try {
        const { phoneNumber, otp } = req.body;
        const verificationResult = await twilioService.confirmVerification(phoneNumber, otp);

        if (verificationResult) {
          const user = {
            id: `sms|${phoneNumber}`,
            name: phoneNumber || '',
            picture: '',
            email: '',
            phone_number: phoneNumber,
          };
          return done(null, user);
        }
        return done({ message: 'Incorrect verification code' }, null);
      } catch (err) {
        return done(err, null);
      }
    }),
  );
};
