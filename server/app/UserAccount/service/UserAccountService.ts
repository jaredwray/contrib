import { Connection, Model } from 'mongoose';

import { UserAccount } from '../dto/UserAccount';
import { IUserAccount, UserAccountModel } from '../mongodb/UserAccountModel';
import { UserAccountStatus } from '../dto/UserAccountStatus';
import { TwilioVerificationService } from '../../../twilio-client';
import { AppError } from '../../../errors/AppError';
import { ErrorCode } from '../../../errors/ErrorCode';
import { Events } from '../../Events';
import { EventHub } from '../../EventHub';

export class UserAccountService {
  private readonly accountModel: Model<IUserAccount> = UserAccountModel(this.connection);

  constructor(
    private readonly connection: Connection,
    private readonly twilioVerificationService: TwilioVerificationService,
    private readonly eventHub: EventHub,
  ) {}

  async getAccountByAuthzId(authzId: string): Promise<UserAccount> {
    const account = await this.accountModel.findOne({ authzId }).exec();
    if (account != null) {
      return {
        id: account.authzId,
        phoneNumber: account.phoneNumber,
        status: UserAccountStatus.COMPLETED,
        mongodbId: account._id.toString(),
      };
    }

    return {
      id: authzId,
      phoneNumber: null,
      status: UserAccountStatus.PHONE_NUMBER_REQUIRED,
    };
  }

  async getAccountByPhoneNumber(phoneNumber: string): Promise<UserAccount> {
    const account = await this.accountModel.findOne({ phoneNumber }).exec();
    if (account != null) {
      return {
        id: account.authzId,
        phoneNumber: account.phoneNumber,
        status: UserAccountStatus.COMPLETED,
        mongodbId: account._id.toString(),
      };
    }
    return null;
  }

  async listAccountsById(ids: readonly string[]): Promise<UserAccount[]> {
    const models = await this.accountModel.find({ _id: { $in: ids } });
    return models.map((model) => ({
      id: model.authzId,
      phoneNumber: model.phoneNumber,
      status: UserAccountStatus.COMPLETED,
      mongodbId: model._id.toString(),
    }));
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

    const accountModel = await this.accountModel.create({ authzId, phoneNumber });
    const account = {
      id: accountModel.authzId,
      phoneNumber: accountModel.phoneNumber,
      status: UserAccountStatus.COMPLETED,
      mongodbId: accountModel._id.toString(),
    };

    await this.eventHub.broadcast(Events.USER_ACCOUNT_CREATED, account);

    return account;
  }
}
