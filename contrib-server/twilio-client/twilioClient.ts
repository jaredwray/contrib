import { Twilio } from 'twilio';
import { AppConfig } from '../config';

const twilio = new Twilio(AppConfig.twilio.accountSid, AppConfig.twilio.authToken);

export const twilioVerify = twilio.verify.services(AppConfig.twilio.verificationService.sid);
