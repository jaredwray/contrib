import { Connection, Model } from 'mongoose';

import { UserAccount } from '../graphql/model/UserAccount';
import { IUserAccount, UserAccountModel } from '../mongodb/UserAccountModel';
import { UserAccountStatus } from '../graphql/model/UserAccountStatus';
import { TwilioVerificationService } from '../../../twilio-client';
import { AppError } from '../../../errors/AppError';
import { ErrorCode } from '../../../errors/ErrorCode';
import { Auth0Service } from '../../../authz';
import { UserRole } from '../../../authz/UserRole';

export class UserAccountService {
  private readonly accountModel: Model<IUserAccount> = UserAccountModel(this.connection);

  constructor(
    private readonly connection: Connection,
    private readonly auth0Service: Auth0Service,
    private readonly twilioVerificationService: TwilioVerificationService,
  ) {}

  async getAccountByAuthzId(authzId: string): Promise<UserAccount> {
    const account = await this.accountModel.findOne({ authzId }).exec();
    if (account != null) {
      return {
        id: account.authzId,
        phoneNumber: account.phoneNumber,
        status: UserAccountStatus.COMPLETED,
      };
    }

    return {
      id: authzId,
      phoneNumber: null,
      status: UserAccountStatus.PHONE_NUMBER_REQUIRED,
    };
  }

  async createAccountWithPhoneNumber(authzId: string, phoneNumber: string): Promise<UserAccount> {
    await this.twilioVerificationService.createVerification(phoneNumber);
    return {
      id: authzId,
      phoneNumber,
      status: UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED,
    };
  }

  async confirmAccountWithPhoneNumber(authzId: string, phoneNumber: string, otp: string): Promise<UserAccount> {
    const result = await this.twilioVerificationService.confirmVerification(phoneNumber, otp);
    if (!result) {
      throw new AppError('Incorrect verification code', ErrorCode.BAD_REQUEST);
    }

    if (await this.accountModel.findOne({ authzId }).exec()) {
      throw new AppError('Account already exists', ErrorCode.BAD_REQUEST);
    }

    if (await this.accountModel.findOne({ phoneNumber }).exec()) {
      throw new AppError(`${phoneNumber} is already in use`, ErrorCode.BAD_REQUEST);
    }

    const account = await this.accountModel.create({ authzId, phoneNumber });
    await this.auth0Service.assignUserRole(authzId, UserRole.PLAIN_USER);

    return {
      id: account.authzId,
      phoneNumber: account.phoneNumber,
      status: UserAccountStatus.COMPLETED,
    };
  }
}
