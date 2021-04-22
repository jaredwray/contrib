import { ClientSession, Connection, Model } from 'mongoose';
import dayjs from 'dayjs';

import { UserAccount } from '../dto/UserAccount';
import { IUserAccount, UserAccountModel } from '../mongodb/UserAccountModel';
import { UserAccountStatus } from '../dto/UserAccountStatus';
import { TwilioVerificationService } from '../../../twilio-client';
import { AppError, ErrorCode } from '../../../errors';
import { Events } from '../../Events';
import { EventHub } from '../../EventHub';
import { TermsService } from '../../TermsService';

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
      return UserAccountService.makeUserAccount(account);
    }

    return {
      id: authzId,
      phoneNumber: null,
      status: UserAccountStatus.PHONE_NUMBER_REQUIRED,
      createdAt: dayjs().toISOString(),
    };
  }

  async getAccountByPhoneNumber(phoneNumber: string, session?: ClientSession): Promise<UserAccount> {
    const account = await this.accountModel.findOne({ phoneNumber }, null, { session }).exec();
    if (account != null) {
      return UserAccountService.makeUserAccount(account);
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
      createdAt: model.createdAt.toISOString(),
    }));
  }

  async createAccountWithPhoneNumber(authzId: string, phoneNumber: string): Promise<UserAccount> {
    await this.twilioVerificationService.createVerification(phoneNumber);
    return {
      id: authzId,
      phoneNumber,
      status: UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED,
      createdAt: dayjs().toISOString(),
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

    const accountModel = await this.accountModel.create({ authzId, phoneNumber, createdAt: dayjs().toISOString() });
    const account = UserAccountService.makeUserAccount(accountModel);

    await this.eventHub.broadcast(Events.USER_ACCOUNT_CREATED, account);

    return account;
  }

  async updateAccountStripeCustomerId(account: UserAccount, stripeCustomerId: string): Promise<UserAccount> {
    if (!account.mongodbId) {
      throw new Error('cannot update non-persisted UserAccount');
    }

    await this.accountModel.updateOne(
      { _id: account.mongodbId },
      {
        $set: { stripeCustomerId },
      },
    );

    return this.getAccountByAuthzId(account.id);
  }

  async acceptTerms(id: string, version: string): Promise<UserAccount> {
    if (!TermsService.isValidVersion(version)) {
      throw new Error(`Terms version ${version} is invalid!`);
    }

    const account = await this.accountModel.findById(id).exec();

    account.acceptedTerms = version;
    account.acceptedTermsAt = new Date();
    await account.save();

    return UserAccountService.makeUserAccount(account);
  }

  private static makeUserAccount(model: IUserAccount): UserAccount {
    const account: UserAccount = {
      id: model.authzId,
      phoneNumber: model.phoneNumber,
      status: UserAccountStatus.COMPLETED,
      mongodbId: model._id.toString(),
      stripeCustomerId: model.stripeCustomerId,
      createdAt: model.createdAt.toISOString(),
      notAcceptedTerms: TermsService.notAcceptedTerms(model.acceptedTerms),
    };

    if (model.isAdmin) {
      account.isAdmin = true;
    }

    return account;
  }
}
