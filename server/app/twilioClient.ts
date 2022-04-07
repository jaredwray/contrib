import { Twilio } from 'twilio';
import { AppConfig } from '../config';

const twilio = new Twilio(AppConfig.twilio.accountSid, AppConfig.twilio.authToken);

export const twilioMessageService = twilio.messages;
export const twilioVerifyService = twilio.verify.services(AppConfig.twilio.verificationService.sid);
