import { ClientSession, Connection, Model } from 'mongoose';
import dayjs from 'dayjs';

import { UserAccount } from '../dto/UserAccount';
import { UserAccountAddress } from '../dto/UserAccountAddress';
import { UserAccountForBid } from '../dto/UserAccountForBid';
import { AuctionDeliveryStatus } from '../../Auction/dto/AuctionDeliveryStatus';
import { AuthUser } from '../../../auth/dto/AuthUser';
import { IUserAccount, UserAccountModel } from '../mongodb/UserAccountModel';
import { IInvitation, InvitationModel } from '../../Invitation/mongodb/InvitationModel';
import { ICharityModel, CharityModel } from '../../Charity/mongodb/CharityModel';
import { IAssistant, AssistantModel } from '../../Assistant/mongodb/AssistantModel';
import { IInfluencer, InfluencerModel } from '../../Influencer/mongodb/InfluencerModel';
import { IAuctionModel, AuctionModel } from '../../Auction/mongodb/AuctionModel';
import { InvitationParentEntityType } from '../../Invitation/mongodb/InvitationParentEntityType';
import { UserAccountStatus } from '../dto/UserAccountStatus';
import { NotificationService } from '../../NotificationService';
import { PhoneNumberVerificationService } from '../../PhoneNumberVerificationService';
import { Events } from '../../Events';
import { EventHub } from '../../EventHub';
import { TermsService } from '../../TermsService';
import { UPSDeliveryService } from '../../UPSService';
import { StripeService } from '../../Payment';
import { MessageTemplate } from '../../NotificationService';
import { isValidAddressFields } from '../../../helpers/isValidAddressFields';

import { AppConfig } from '../../../config';
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
    private readonly notificationService: NotificationService,
    private readonly phoneNumberVerificationService: PhoneNumberVerificationService,
    private readonly eventHub: EventHub,
    private readonly UPSService: UPSDeliveryService,
    private readonly stripeService: StripeService,
  ) {}

  public async createOrUpdateUserAddress(
    auctionId: string,
    userId: string,
    stripeId: string,
    input: UserAccountAddress,
  ): Promise<UserAccountAddress> {
    if (!isValidAddressFields(input))
      throw new AppError('Something went wrong. Please, check the entered data or try later');

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
      await this.UPSService.getDeliveryPrice(input, '03');

      Object.assign(auction.delivery, {
        address: { ...input },
        status: AuctionDeliveryStatus.ADDRESS_PROVIDED,
        updatedAt: this.timeNow(),
      });
      Object.assign(user, {
        address: { ...input },
        updatedAt: this.timeNow(),
      });

      await auction.save();
      await user.save();
      await this.stripeService.updateStripeCustomerAddress(stripeId, input);

      return input;
    } catch (error) {
      AppLogger.error(`Can not create or update user address for user #${userId}: ${error.message}`);

      if (error.message.startsWith('The postal code')) throw new AppError(error.message);

      throw new AppError('Something went wrong. Please, check the entered data');
    }
  }

  public async updateUserAddress(
    auctionId: string,
    userId: string,
    stripeId: string,
    input: UserAccountAddress,
  ): Promise<UserAccountAddress> {

    const auction = await this.AuctionModel.findById(auctionId);
    if (!auction) {
      AppLogger.error(`Can not find auction #${auctionId}`);
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
        updatedAt: this.timeNow(),
      });

      await user.save();

      return input;
    } catch (error) {
      AppLogger.error(`Can not create or update user address for user #${userId}: ${error.message}`);

      if (error.message.startsWith('The postal code')) throw new AppError(error.message);

      throw new AppError('Something went wrong. Please, check the entered data');
    }
  }

  async getAccountByAuthzId(authzId: string, user?: AuthUser): Promise<UserAccount> {
    let account = await this.AccountModel.findOne({ authzId }).exec();

    if (account != null) {
      const filter = { userAccount: account._id };
      const accountEntityTypes = {
        assistant: await this.AssistantModel.exists(filter),
        charity: await this.CharityModel.exists(filter),
        influencer: await this.InfluencerModel.exists(filter),
      };

      return UserAccountService.makeUserAccount(account, accountEntityTypes);
    }

    if (authzId.startsWith('sms|')) return await this.confirmAccountWithPhoneNumber(authzId, user.phone_number);

    return {
      id: authzId,
      phoneNumber: null,
      status: UserAccountStatus.PHONE_NUMBER_REQUIRED,
      createdAt: dayjs().second(0),
    };
  }

  async getAccountById(id: string): Promise<UserAccountForBid> {
    const account = await this.AccountModel.findOne({ _id: id }).exec();
    if (!account) return null;

    return {
      id: account._id.toString(),
      createdAt: account.createdAt,
      phoneNumber: account.phoneNumber,
      stripeCustomerId: account.stripeCustomerId,
    };
  }

  async getAccountByPhoneNumber(phoneNumber: string, session?: ClientSession): Promise<UserAccount> {
    const account = await this.AccountModel.findOne({ phoneNumber }, null, { session }).exec();

    return account && UserAccountService.makeUserAccount(account);
  }

  async listAccountsById(ids: readonly string[]): Promise<UserAccount[]> {
    const models = await this.AccountModel.find({ _id: { $in: ids } });
    return models.map((model) => ({
      id: model.authzId,
      phoneNumber: model.phoneNumber,
      status: UserAccountStatus.COMPLETED,
      mongodbId: model._id.toString(),
      createdAt: model.createdAt,
    }));
  }

  async verifyChangePhoneNumber(phoneNumber: string): Promise<{ phoneNumber: string } | null> {
    if (await this.AccountModel.exists({ phoneNumber }))
      throw new AppError(`${phoneNumber} is already in use`, ErrorCode.BAD_REQUEST);

    await this.phoneNumberVerificationService.createVerification(phoneNumber);
    return { phoneNumber };
  }

  async createAccountWithPhoneNumber(authzId: string, phoneNumber: string): Promise<UserAccount> {
    if (await this.AccountModel.exists({ phoneNumber }))
      throw new AppError(`${phoneNumber} is already in use`, ErrorCode.BAD_REQUEST);

    if (
      await this.InvitationModel.exists({
        phoneNumber,
        parentEntityType: InvitationParentEntityType.CHARITY,
      })
    )
      return await this.confirmAccountWithPhoneNumber(authzId, phoneNumber);

    await this.phoneNumberVerificationService.createVerification(phoneNumber);

    return {
      id: authzId,
      phoneNumber,
      status: UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED,
      createdAt: dayjs().second(0),
    };
  }

  async confirmChangePhoneNumber(input: {
    userId: string;
    newPhoneNumber: string;
    oldPhoneNumber: string;
    otp: string;
  }): Promise<{ phoneNumber: string } | null> {
    const { userId, newPhoneNumber, oldPhoneNumber, otp } = input;
    const result = await this.phoneNumberVerificationService.confirmVerification(newPhoneNumber, otp);

    if (!result) throw new AppError('Incorrect verification code', ErrorCode.BAD_REQUEST);

    try {
      await this.AccountModel.findByIdAndUpdate(userId, { phoneNumber: newPhoneNumber });
      return { phoneNumber: newPhoneNumber };
    } catch (error) {
      AppLogger.error(`Cannot update phoneNumber for user #${userId}. Error: ${error.message}`);
      throw new AppError(`Something went wrong, please try later.`, ErrorCode.BAD_REQUEST);
    }

    await this.notificationService.sendMessageLater(oldPhoneNumber, MessageTemplate.PHONE_NUMBER_CHANGED, {
      oldPhoneNumber,
      newPhoneNumber,
      contactEmail: AppConfig.app.contactEmail,
    });
  }

  async sendOtp(phoneNumber: string) {
    await this.phoneNumberVerificationService.createVerification(phoneNumber);
    return { phoneNumber };
  }

  async confirmAccountWithPhoneNumber(authzId: string, phoneNumber: string, otp?: string): Promise<UserAccount> {
    if (otp) {
      const result = await this.phoneNumberVerificationService.confirmVerification(phoneNumber, otp);
      if (!result) throw new AppError('Incorrect verification code', ErrorCode.BAD_REQUEST);
    }

    if (await this.AccountModel.exists({ authzId }))
      throw new AppError('Account already exists', ErrorCode.BAD_REQUEST);

    const findedAccount = await this.AccountModel.findOne({ phoneNumber }).exec();

    if (findedAccount && authzId.startsWith('sms|')) return UserAccountService.makeUserAccount(findedAccount);
    if (findedAccount) throw new AppError(`${phoneNumber} is already in use`, ErrorCode.BAD_REQUEST);

    const accountModel = await this.AccountModel.create({ authzId, phoneNumber, createdAt: dayjs().toISOString() });
    const account = UserAccountService.makeUserAccount(accountModel);
    await this.eventHub.broadcast(Events.USER_ACCOUNT_CREATED, account);

    return account;
  }

  async updateAccountStripeCustomerId(account: UserAccount, stripeCustomerId: string): Promise<UserAccount> {
    if (!account.mongodbId) throw new Error('cannot update non-persisted UserAccount');

    await this.AccountModel.updateOne(
      { _id: account.mongodbId },
      { $set: { stripeCustomerId, updatedAt: this.timeNow() } },
    );

    return this.getAccountByAuthzId(account.id);
  }

  async acceptTerms(id: string, version: string): Promise<UserAccount> {
    if (!TermsService.isValidVersion(version)) throw new Error(`Terms version ${version} is invalid!`);

    const account = await this.AccountModel.findById(id).exec();

    Object.assign(account, {
      acceptedTerms: version,
      acceptedTermsAt: this.timeNow(),
      updatedAt: this.timeNow(),
    });
    await account.save();

    return UserAccountService.makeUserAccount(account);
  }

  private timeNow = () => dayjs().second(0);
  private static makeUserAccount(model: IUserAccount, accountEntityTypes?): UserAccount {
    const { _id, authzId, acceptedTerms, ...rest } = model.toObject();

    return {
      id: authzId,
      status: UserAccountStatus.COMPLETED,
      mongodbId: _id.toString(),
      notAcceptedTerms: TermsService.notAcceptedTerms(acceptedTerms, accountEntityTypes),
      createdAt: dayjs().second(0),
      ...rest,
    };
  }
}
