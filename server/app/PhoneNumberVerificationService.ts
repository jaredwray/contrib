import { Twilio } from 'twilio';

import { AppError, ErrorCode } from '../errors';
import { AppLogger } from '../logger';
import { AppConfig } from '../config';

const twilio = new Twilio(AppConfig.twilio.accountSid, AppConfig.twilio.authToken);
const verifyService = twilio.verify.services(AppConfig.twilio.verificationService.sid);

export class PhoneNumberVerificationService {
  async createVerification(phoneNumber: string): Promise<void> {
    try {
      const verification = await verifyService.verifications.create({ to: phoneNumber, channel: 'sms' });
      AppLogger.debug(`created twilio verification: ${JSON.stringify(verification)}`);
    } catch (error) {
      if (error.message.startsWith('Invalid parameter `To`'))
        throw new AppError(`${error.message.replace('Invalid parameter `To`', 'Invalid phone number')}`);

      AppLogger.error(`Cannot send phone number verification message to ${phoneNumber}: ${error.message}`);

      throw new AppError(`Something went wrong, please try later.`, ErrorCode.BAD_REQUEST);
    }
  }

  async confirmVerification(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      const verificationResult = await verifyService.verificationChecks.create({
        to: phoneNumber,
        code: otp,
      });
      AppLogger.debug(`attempted to confirm twilio verification: ${JSON.stringify(verificationResult)}`);
      return verificationResult.status === 'approved';
    } catch (error) {
      AppLogger.error(`error confirming twilio verification: ${error.message}`);
      return false;
    }
  }
}
