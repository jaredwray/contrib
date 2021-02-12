import { Twilio } from 'twilio';

export const twilio = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
export const verifications = twilio.verify.services(process.env.VERIFICATION_SID).verifications;
export const verificationChecks = twilio.verify.services(process.env.VERIFICATION_SID).verificationChecks;
