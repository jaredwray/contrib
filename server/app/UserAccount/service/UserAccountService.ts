import { ClientSession, Connection, Model } from 'mongoose';
import dayjs from 'dayjs';

import { UserAccount } from '../dto/UserAccount';
import { UserAccountAddress } from '../dto/UserAccountAddress';
import { UserAccountForBid } from '../dto/UserAccountForBid';
import { IUserAccount, UserAccountModel } from '../mongodb/UserAccountModel';
import { IInvitation, InvitationModel } from '../../Invitation/mongodb/InvitationModel';
import { ICharityModel, CharityModel } from '../../Charity/mongodb/CharityModel';
import { IAssistant, AssistantModel } from '../../Assistant/mongodb/AssistantModel';
import { IInfluencer, InfluencerModel } from '../../Influencer/mongodb/InfluencerModel';
import { IAuctionModel, AuctionModel } from '../../Auction/mongodb/AuctionModel';
import { InvitationParentEntityType } from '../../Invitation/mongodb/InvitationParentEntityType';
import { UserAccountStatus } from '../dto/UserAccountStatus';
import { TwilioVerificationService } from '../../../twilio-client';
import { Events } from '../../Events';
import { EventHub } from '../../EventHub';
import { TermsService } from '../../TermsService';
import { Auth0Service } from '../../../authz';

import { AppError, ErrorCode } from '../../../errors';
import { AppLogger } from '../../../logger';

export class UserAccountService {
  private readonly AccountModel: Model<IUserAccount> = UserAccountModel(this.connection);
  private readonly AssistantModel: Model<IAssistant> = AssistantModel(this.connection);
  private readonly AuctionModel: Model<IAuctionModel> = AuctionModel(this.connection);
  private readonly CharityModel: Model<ICharityModel> = CharityModel(this.connection);
  private readonly InfluencerModel: Model<IInfluencer> = InfluencerModel(this.connection);
  private readonly InvitationModel: Model<IInvitation> = InvitationModel(this.connection);

  constructor(
    private readonly connection: Connection,
    private readonly twilioVerificationService: TwilioVerificationService,
    private readonly eventHub: EventHub,
    private readonly auth0Service: Auth0Service,
  ) {}

  public async createOrUpdateUserAddress(
    auctionId: string,
    userId: string,
    input: UserAccountAddress,
  ): Promise<UserAccountAddress> {
    const auction = await this.AuctionModel.findById(auctionId);

    if (!auction) {
      AppLogger.error(`Can not find auction #${auctionId}`);
      throw new AppError('Something went wrong. Please, try again later');
    }

    if (auction.winner.toString() !== userId) {
      AppLogger.error(`Current user #${userId} is not a winner for auction #${auctionId}`);
      throw new AppError('Something went wrong. Please, try again later');
    }
    const user = await this.AccountModel.findById(userId);

    if (!user) {
      AppLogger.error(`Can not find user #${userId} for create or update user address`);
      throw new AppError('Something went wrong. Please, try again later');
    }
    try {
      Object.assign(user, {
        address: { ...input },
      });

      await user.save();
      return input;
    } catch (error) {
      AppLogger.error(`Can not create or update user address for user #${userId}`);
      throw new AppError('Something went wrong. Please, try again later');
    }
  }

  async getAccountByAuthzId(authzId: string): Promise<UserAccount> {
    const account = await this.AccountModel.findOne({ authzId }).exec();

    if (account != null) {
      const filter = { userAccount: account._id };
      const accountEntityTypes = {
        assistant: await this.AssistantModel.exists(filter),
        charity: await this.CharityModel.exists(filter),
        influencer: await this.InfluencerModel.exists(filter),
      };
      return UserAccountService.makeUserAccount(account, accountEntityTypes);
    }
    if (authzId.includes('sms')) {
      const user = await this.auth0Service.getUser(authzId);
      return await this.confirmAccountWithPhoneNumber(authzId, user.phone_number);
    }
    return {
      id: authzId,
      phoneNumber: null,
      status: UserAccountStatus.PHONE_NUMBER_REQUIRED,
      createdAt: dayjs().toISOString(),
    };
  }

  async getAccountById(id: string): Promise<UserAccountForBid> {
    const account = await this.AccountModel.findOne({ _id: id }).exec();
    if (account != null) {
      return {
        id: account._id.toString(),
        createdAt: account.createdAt.toISOString(),
        phoneNumber: account.phoneNumber,
        stripeCustomerId: account.stripeCustomerId,
      };
    }
    return null;
  }

  async getAccountByPhoneNumber(phoneNumber: string, session?: ClientSession): Promise<UserAccount> {
    const account = await this.AccountModel.findOne({ phoneNumber }, null, { session }).exec();
    if (account != null) {
      return UserAccountService.makeUserAccount(account);
    }
    return null;
  }

  async listAccountsById(ids: readonly string[]): Promise<UserAccount[]> {
    const models = await this.AccountModel.find({ _id: { $in: ids } });
    return models.map((model) => ({
      id: model.authzId,
      phoneNumber: model.phoneNumber,
      status: UserAccountStatus.COMPLETED,
      mongodbId: model._id.toString(),
      createdAt: model.createdAt.toISOString(),
    }));
  }

  async createAccountWithPhoneNumber(authzId: string, phoneNumber: string): Promise<UserAccount> {
    if (await this.AccountModel.findOne({ phoneNumber }).exec()) {
      throw new AppError(`${phoneNumber} is already in use`, ErrorCode.BAD_REQUEST);
    }

    if (
      await this.InvitationModel.exists({
        phoneNumber,
        parentEntityType: InvitationParentEntityType.CHARITY,
      })
    ) {
      return await this.confirmAccountWithPhoneNumber(authzId, phoneNumber);
    }

    await this.twilioVerificationService.createVerification(phoneNumber);
    return {
      id: authzId,
      phoneNumber,
      status: UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED,
      createdAt: dayjs().toISOString(),
    };
  }

  async confirmAccountWithPhoneNumber(authzId: string, phoneNumber: string, otp?: string): Promise<UserAccount> {
    if (otp) {
      const result = await this.twilioVerificationService.confirmVerification(phoneNumber, otp);
      if (!result) {
        throw new AppError('Incorrect verification code', ErrorCode.BAD_REQUEST);
      }
    }

    if (await this.AccountModel.findOne({ authzId }).exec()) {
      throw new AppError('Account already exists', ErrorCode.BAD_REQUEST);
    }
    const findedAccount = await this.AccountModel.findOne({ phoneNumber }).exec();
    if (findedAccount && authzId.includes('sms')) {
      return UserAccountService.makeUserAccount(findedAccount);
    }
    if (findedAccount) {
      throw new AppError(`${phoneNumber} is already in use`, ErrorCode.BAD_REQUEST);
    }

    const accountModel = await this.AccountModel.create({ authzId, phoneNumber, createdAt: dayjs().toISOString() });
    const account = UserAccountService.makeUserAccount(accountModel);

    await this.eventHub.broadcast(Events.USER_ACCOUNT_CREATED, account);

    return account;
  }

  async updateAccountStripeCustomerId(account: UserAccount, stripeCustomerId: string): Promise<UserAccount> {
    if (!account.mongodbId) {
      throw new Error('cannot update non-persisted UserAccount');
    }

    await this.AccountModel.updateOne(
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

    const account = await this.AccountModel.findById(id).exec();

    account.acceptedTerms = version;
    account.acceptedTermsAt = new Date();
    await account.save();

    return UserAccountService.makeUserAccount(account);
  }

  private static makeUserAccount(model: IUserAccount, accountEntityTypes?): UserAccount {
    const account: UserAccount = {
      id: model.authzId,
      phoneNumber: model.phoneNumber,
      status: UserAccountStatus.COMPLETED,
      mongodbId: model._id.toString(),
      stripeCustomerId: model.stripeCustomerId,
      createdAt: model.createdAt.toISOString(),
      notAcceptedTerms: TermsService.notAcceptedTerms(model.acceptedTerms, accountEntityTypes),
      address: model.address,
    };

    if (model.isAdmin) {
      account.isAdmin = true;
    }

    return account;
  }
}
