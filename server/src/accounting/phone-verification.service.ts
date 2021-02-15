import { Twilio } from 'twilio';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../environment-variables';
import { AppLogger } from '../logging/app-logger.service';
import { BaseError } from '../errors/base-error';
import { VerificationCheckInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck';

const TwilioBadRequestErrorCode = 60200;

@Injectable()
export class PhoneVerificationService {
  private twilio: Twilio;

  constructor(private logger: AppLogger, private configService: ConfigService<EnvironmentVariables>) {
    this.logger.setContext('PhoneVerificationService');
    this.twilio = new Twilio(
      configService.get<string>('TWILIO_ACCOUNT_SID'),
      configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async createVerification(phone: string): Promise<void> {
    this.logger.log(`generating sms verification for ${phone}`);
    try {
      const verificationRequest = await this.twilio.verify
        .services(this.configService.get<string>('VERIFICATION_SID'))
        .verifications.create({ to: phone, channel: 'sms' });
      this.logger.debug(JSON.stringify(verificationRequest));
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)} / ${JSON.stringify(error.code)}`);
      if (error.code === TwilioBadRequestErrorCode) {
        throw new BaseError('Invalid phone number');
      }
      throw error;
    }
  }

  async confirmVerification(phone: string, otp: string): Promise<void> {
    this.logger.log(`confirming sms verification for ${phone}`);
    let verificationResult: VerificationCheckInstance;
    try {
      verificationResult = await this.twilio.verify
        .services(this.configService.get<string>('VERIFICATION_SID'))
        .verificationChecks.create({ to: phone, code: otp });
      this.logger.debug(`verification result = ${JSON.stringify(verificationResult)}`);
    } catch (error) {
      if (error.code === TwilioBadRequestErrorCode) {
        throw new BaseError('Incorrect verification code');
      }
      throw error;
    }

    if (verificationResult.status !== 'approved') {
      throw new BaseError('Incorrect verification code');
    }
  }
}
