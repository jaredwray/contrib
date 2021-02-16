import { twilioMessages } from './twilioClient';
import { AppLogger } from '../logger';
import { AppConfig } from '../config';

export class TwilioNotificationService {
  async sendMessage(phoneNumber: string, text: string) {
    const result = await twilioMessages.create({
      body: text,
      to: phoneNumber,
      from: AppConfig.twilio.senderNumber,
    });
    AppLogger.debug(`sent notification to ${phoneNumber}: ${JSON.stringify(result)}`);
  }
}
