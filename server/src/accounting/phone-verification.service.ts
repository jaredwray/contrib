import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/environment-variables';
import { AppLogger } from 'src/logging/app-logger.service';
import * as twilio from 'twilio';
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';
import { VerificationCheckInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck';

@Injectable()
export class PhoneVerificationService {
  private twilio: twilio.Twilio;

  constructor(
    private logger: AppLogger,
    private configService: ConfigService<EnvironmentVariables>,
  ) {
    this.logger.setContext('PhoneVerificationService');
    this.twilio = twilio(
      configService.get<string>('TWILIO_ACCOUNT_SID'),
      configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async createVerification(phone: string): Promise<boolean> {
    this.logger.log(`generating sms verification for ${phone}`);
    let verificationRequest: VerificationInstance;
    try {
      verificationRequest = await this.twilio.verify
        .services(this.configService.get<string>('VERIFICATION_SID'))
        .verifications.create({ to: phone, channel: 'sms' });
    } catch (e) {
      this.logger.error(e);
      return false;
    }
    this.logger.debug(JSON.stringify(verificationRequest));
    return true;
  }

  async confirmVerification(phone: string, otp: string): Promise<boolean> {
    this.logger.log(`confirming sms verification for ${phone}`);
    let verificationResult: VerificationCheckInstance;
    try {
      verificationResult = await this.twilio.verify
        .services(this.configService.get<string>('VERIFICATION_SID'))
        .verificationChecks.create({ to: phone, code: otp });
    } catch (e) {
      this.logger.error(e);
      return false;
    }
    this.logger.debug(JSON.stringify(verificationResult));
    return verificationResult.status === 'approved';
  }
}
