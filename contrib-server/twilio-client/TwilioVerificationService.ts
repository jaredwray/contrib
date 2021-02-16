import { twilioVerify } from './twilioClient';
import { AppLogger } from '../logger';

export class TwilioVerificationService {
  async createVerification(phoneNumber: string): Promise<void> {
    const verification = await twilioVerify.verifications.create({ to: phoneNumber, channel: 'sms' });
    AppLogger.debug(`created twilio verification: ${JSON.stringify(verification)}`);
  }

  async confirmVerification(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      const verificationResult = await twilioVerify.verificationChecks.create({ to: phoneNumber, code: otp });
      AppLogger.debug(`attempted to confirm twilio verification: ${JSON.stringify(verificationResult)}`);
      return verificationResult.status === 'approved';
    } catch (error) {
      AppLogger.error(`error confirming twilio verification: ${error.message}`);
      return false;
    }
  }
}
