import dayjs from 'dayjs';
import Dinero from 'dinero.js';
import { Storage } from '@google-cloud/storage';
import { ClientSession, Connection, ObjectId } from 'mongoose';

import { UserAccountModel, IUserAccount } from '../../UserAccount/mongodb/UserAccountModel';
import { CharityModel, ICharityModel } from '../mongodb/CharityModel';
import { Charity } from '../dto/Charity';
import { CharitySearchParams, CharityFilters } from '../dto/CharitySearchParams';
import { CharityOrderBy } from '../dto/CharityOrderBy';
import { CharityInput } from '../graphql/model/CharityInput';
import { CharityStatus } from '../dto/CharityStatus';
import { CharityProfileStatus } from '../dto/CharityProfileStatus';
import { CharityStripeStatus } from '../dto/CharityStripeStatus';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { UpdateCharityProfileInput } from '../graphql/model/UpdateCharityProfileInput';
import { EventHub } from '../../EventHub';
import { Events } from '../../Events';
import { StripeService } from '../../Payment';
import { AppConfig } from '../../../config';
import { AppLogger } from '../../../logger';
import { AppError } from '../../../errors';
import { webSiteFormatter } from '../../../helpers/webSiteFormatter';
import { objectTrimmer } from '../../../helpers/objectTrimmer';

interface CharityCreationInput {
  name: string;
}

export class CharityService {
  private readonly CharityModel = CharityModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);

  constructor(
    private readonly connection: Connection,
    private readonly eventHub: EventHub,
    private readonly stripeService: StripeService,
  ) {
    eventHub.subscribe(Events.CHARITY_ONBOARDED, async ({ charity, session }) => {
      await this.createStripeAccountForCharity(charity, session);
    });
  }

  async handleFollowLogicErrors(
    charityId: string,
    accountId: string,
    session: ClientSession,
  ): Promise<{ charity: ICharityModel; account: IUserAccount }> {
    const charity = await this.CharityModel.findById(charityId, null, { session }).exec();
    if (!charity) {
      AppLogger.error(`Charity record #${charityId} not found`);
      throw new AppError('Something went wrong. Please, try later');
    }

    if (charity.status !== CharityStatus.ACTIVE) {
      AppLogger.error(`Charity record #${charityId} not found`);
      throw new AppError('Can not follow to incative Charity');
    }

    const account = await this.UserAccountModel.findById(accountId, null, { session }).exec();
    if (!account) {
      AppLogger.error(`Account record #${accountId} not found`);
      throw new AppError('Something went wrong. Please, try later');
    }

    return {
      charity,
      account,
    };
  }

  async followCharity(charityId: string, accountId: string) {
    const session = await this.connection.startSession();

    let returnObject = null;
    try {
      await session.withTransaction(async () => {
        const { charity, account } = await this.handleFollowLogicErrors(charityId, accountId, session);

        const currentAccountId = account._id.toString();
        const followed = charity.followers.some((follower) => follower.user.toString() === currentAccountId);

        if (followed) {
          throw new AppError('You have already followed to this charity');
        }

        const createdFollower = {
          user: currentAccountId,
          createdAt: dayjs(),
        };

        const charityProfileId = charity._id.toString();

        const createdFollowing = {
          charityProfile: charityProfileId,
          createdAt: dayjs(),
        };

        Object.assign(charity, {
          followers: [...charity.followers, createdFollower],
        });

        Object.assign(account, {
          followingCharitis: [...account.followingCharitis, createdFollowing],
        });

        await charity.save({ session });
        await account.save({ session });

        returnObject = createdFollower;
      });
      return returnObject;
    } catch (error) {
      AppLogger.error(`Cannot follow Charity with id #${charityId}: ${error.message}`);
      throw new AppError('Something went wrong. Please, try later');
    } finally {
      session.endSession();
    }
  }

  async unfollowCharity(charityId: string, accountId: string) {
    const session = await this.connection.startSession();

    let returnObject = null;
    try {
      await session.withTransaction(async () => {
        const { charity, account } = await this.handleFollowLogicErrors(charityId, accountId, session);

        const charityProfileId = charity._id.toString();

        account.followingCharitis = account.followingCharitis.filter(
          (follow) => follow?.charityProfile?.toString() !== charityProfileId,
        );

        const currentAccountId = account._id.toString();

        charity.followers = charity.followers.filter((follower) => follower.user.toString() !== currentAccountId);

        await charity.save({ session });
        await account.save({ session });

        returnObject = { id: Date.now().toString() };
      });
      return returnObject;
    } catch (error) {
      AppLogger.error(`Cannot unfollow Charity with id #${charityId}: ${error.message}`);
      throw new AppError('Something went wrong. Please, try later');
    } finally {
      session.endSession();
    }
  }

  async createStripeAccountForCharity(charity: Charity, session): Promise<Charity> {
    const model = await this.CharityModel.findById(charity.id, null, { session }).exec();

    model.status = CharityStatus.PENDING_ONBOARDING;

    const stripeAccount = await this.stripeService.createStripeAccount();
    model.stripeAccountId = stripeAccount.id;

    await model.save({ session });
    return CharityService.makeCharity(model);
  }

  async updateCharityByStripeAccount(account: any): Promise<void> {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        const charityModel = await this.CharityModel.findOne({ stripeAccountId: account.id }, null, session).exec();
        const charity = CharityService.makeCharity(charityModel);
        const isAccountActive =
          account.capabilities.card_payments === 'active' && account.capabilities.transfers === 'active';
        const stripeStatus = isAccountActive ? CharityStripeStatus.ACTIVE : CharityStripeStatus.INACTIVE;

        await this.updateCharityStatus({ charity, stripeStatus, session });
        AppLogger.info(`Charity #${charityModel._id} was updated by stripe account to ${stripeStatus}`);
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  }

  async maybeUpdateStripeLink(charity: Charity): Promise<Charity> {
    if (charity.status === CharityStatus.PENDING_INVITE) {
      throw new Error('charity can not exist');
    }

    if (charity.status !== CharityStatus.PENDING_ONBOARDING) {
      return charity;
    }
    const stripeAccountLink = await this.getLinkForStripeAccount(charity);
    const charityUpd = {
      ...charity,
      stripeAccountLink,
    };
    return charityUpd;
  }

  async getLinkForStripeAccount(charity: Charity): Promise<string> {
    const objLink = await this.stripeService.createStripeObjLink(charity.stripeAccountId, charity.id);
    return objLink.url;
  }

  async createCharity({ name }: CharityCreationInput, session?: ClientSession): Promise<Charity> {
    const charityModel = await this.CharityModel.create(
      [
        {
          name,
          status: CharityStatus.PENDING_INVITE,
          profileStatus: CharityProfileStatus.CREATED,
        },
      ],
      { session },
    );
    return CharityService.makeCharity(charityModel[0]);
  }

  async findCharityByUserAccount(userAccount: string): Promise<Charity | null> {
    const charity = await this.CharityModel.findOne({ userAccount }).exec();
    return (charity && CharityService.makeCharity(charity)) ?? null;
  }

  async findCharity(id: string, session?: ClientSession): Promise<Charity | null> {
    try {
      const charity = await this.CharityModel.findById(id, null, { session }).exec();
      return (charity && CharityService.makeCharity(charity)) ?? null;
    } catch (error) {
      AppLogger.error(`Cannot find charity with id #${id}: ${error.message}`);
    }
  }

  async updateCharityProfileById(id: string, input: UpdateCharityProfileInput): Promise<Charity | void> {
    const session = await this.connection.startSession();
    try {
      const charity = await this.CharityModel.findById(id, null, { session }).exec();

      await session.withTransaction(async () => {
        if (!charity) {
          throw new Error(`charity record #${id} not found`);
        }

        if (charity.profileStatus === CharityProfileStatus.CREATED) {
          charity.profileStatus = CharityProfileStatus.COMPLETED;
        }

        Object.assign(charity, { ...objectTrimmer(input), website: webSiteFormatter(input.website).trim() });

        this.maybeActivateCharity(charity);

        await charity.save({ session });
      });

      session.endSession();
      AppLogger.error(`updateCharityProfileById: ${JSON.stringify(charity, null, 2)}`);
      return CharityService.makeCharity(charity);
    } catch (error) {
      session.endSession();
      throw error;
    }
  }

  private maybeActivateCharity(charity: ICharityModel): void {
    AppLogger.error(`maybeActivateCharity: ${JSON.stringify(charity, null, 2)}`);
    if (
      charity.stripeStatus === CharityStripeStatus.ACTIVE &&
      charity.profileStatus === CharityProfileStatus.COMPLETED
    ) {
      charity.status = CharityStatus.ACTIVE;
      charity.activatedAt = dayjs().second(0);
    }
  }

  async updateCharityProfileAvatarById(id: string, image: any): Promise<Charity> {
    const charity = await this.CharityModel.findOne({ _id: id }).exec();
    if (!charity) {
      throw new Error(`charity record #${id} not found`);
    }
    const { filename: originalFilename, createReadStream } = await image;
    const ALLOWED_EXTENSIONS = /png|jpeg|jpg|webp/i;
    const extension = originalFilename.split('.').pop();
    if (!ALLOWED_EXTENSIONS.test(extension)) {
      AppLogger.error('File has unsupported extension: ', originalFilename);
      return;
    }
    const filename = `${charity._id}/avatar/avatar.webp`;
    const filePath = `pending/${filename}`;
    const bucketName = AppConfig.googleCloud.bucketName;
    const storage = new Storage({ credentials: JSON.parse(AppConfig.googleCloud.keyDump) });
    await createReadStream().pipe(
      storage
        .bucket(bucketName)
        .file(filePath)
        .createWriteStream({ metadata: { cacheControl: 'no-store' } })
        .on('finish', () => {
          const bucketFullPath = `https://storage.googleapis.com/${bucketName}`;
          storage
            .bucket(bucketName)
            .file(filePath)
            .makePublic()
            .then(() => {
              charity.avatarUrl = `${bucketFullPath}/${filename}`;
              charity.save();
            })
            .catch((e: any) => AppLogger.error(`exec error : ${e}`));
        }),
    );
    return CharityService.makeCharity(charity);
  }

  async assignUserToCharity(id: ObjectId, userAccountId: string, session: ClientSession): Promise<Charity> {
    const charity = await this.CharityModel.findById(id, null, { session }).exec();
    if (!charity) {
      throw new Error(`cannot assign user to charity: charity ${id} is not found`);
    }

    if (charity.status !== CharityStatus.PENDING_INVITE) {
      throw new Error(`cannot assign user to charity: charity ${id} status is ${charity.status} `);
    }
    if (charity.userAccount) {
      throw new Error(`cannot assign user to charity: charity ${id} already has a user account assigned`);
    }
    charity.userAccount = userAccountId;
    await charity.save();
    return CharityService.makeCharity(charity);
  }

  async updateCharityStatus({
    charity,
    userAccount,
    status,
    stripeStatus,
    profileStatus,
    session,
  }: {
    charity: Charity;
    userAccount?: UserAccount;
    status?: CharityStatus;
    stripeStatus?: CharityStripeStatus;
    profileStatus?: CharityProfileStatus;
    session?: ClientSession;
  }): Promise<Charity> {
    const model = await this.CharityModel.findById(charity.id, null, { session }).exec();

    if (!status && !profileStatus && !stripeStatus) {
      throw new Error('at least one status must be updated');
    }

    if (status) {
      model.status = status;
    }

    if (stripeStatus) {
      model.stripeStatus = stripeStatus;
    }

    if (profileStatus) {
      model.profileStatus = profileStatus;
    }

    if (userAccount) {
      if (model.userAccount) {
        throw new Error('attempting to override user account for a charity');
      }
      model.userAccount = userAccount.mongodbId;
    }
    try {
      this.maybeActivateCharity(model);
      await model.save({ session });
    } catch (error) {
      AppLogger.info(`Cannot update charity #${charity.id}: ${error.message}`);
      throw error;
    }
    return CharityService.makeCharity(model);
  }

  async updateCharity(id: string, input: CharityInput): Promise<Charity | null> {
    const charity = await this.CharityModel.findById(id).exec();
    if (!charity) {
      throw new Error(`charity record not found`);
    }
    Object.assign(charity, objectTrimmer(input));
    await charity.save();
    return CharityService.makeCharity(charity);
  }

  private ORDER_SORTS = {
    [CharityOrderBy.STATUS_ASC]: { status: 'asc' },
    [CharityOrderBy.NAME_ASC]: { name: 'asc' },
    [CharityOrderBy.NAME_DESC]: { name: 'desc' },
    [CharityOrderBy.ACTIVATED_AT_ASC]: { activatedAt: 'asc' },
    [CharityOrderBy.ACTIVATED_AT_DESC]: { activatedAt: 'desc' },
    [CharityOrderBy.TOTALRAISEDAMOUNT_ASC]: { totalRaisedAmount: 'asc' },
    [CharityOrderBy.TOTALRAISEDAMOUNT_DESC]: { totalRaisedAmount: 'desc' },
  };

  public getSearchOptions(filters: CharityFilters): object {
    return ([
      [filters?.status, { status: { $in: filters?.status } }],
      [filters?.query, { name: { $regex: (filters?.query || '').trim(), $options: 'i' } }],
    ] as [string, { [key: string]: any }][]).reduce(
      (hash, [condition, filters]) => ({ ...hash, ...(condition ? filters : {}) }),
      {},
    );
  }

  public getSortOptions(orderBy: string): string {
    return this.ORDER_SORTS[orderBy];
  }

  public async getCharities({ filters, orderBy, skip = 0, size }: CharitySearchParams): Promise<ICharityModel[]> {
    const charities = this.CharityModel.find(this.getSearchOptions(filters))
      .skip(skip)
      .limit(size)
      .sort(this.getSortOptions(orderBy));
    return await charities.exec();
  }

  public async getCharitiesCount({ filters }: { filters?: CharityFilters }) {
    return this.CharityModel.find(this.getSearchOptions(filters)).countDocuments().exec();
  }

  public async charitiesList(params: CharitySearchParams) {
    const items = await this.getCharities(params);
    const totalItems = await this.getCharitiesCount(params);

    return {
      totalItems,
      items: items.map((item) => CharityService.makeCharity(item)),
      size: items.length,
      skip: params.skip || 0,
    };
  }

  async listCharitiesByUserAccountIds(userAccountIds: readonly string[]): Promise<Charity[]> {
    const models = await this.CharityModel.find({ userAccount: { $in: userAccountIds } });
    return models.map((charity) => CharityService.makeCharity(charity));
  }

  async listCharitiesByIds(charityIds: readonly string[]): Promise<Charity[]> {
    if (charityIds.length === 0) {
      return [];
    }
    const charities = await this.CharityModel.find({ _id: { $in: charityIds } }).exec();
    return charities.map((charity) => CharityService.makeCharity(charity));
  }

  private static websiteUrl(website: string): string | null {
    if (/https?:\/\//.test(website)) return website;

    return `http://${website}`;
  }

  public static makeCharity(model: ICharityModel): Charity | null {
    if (!model) {
      return null;
    }

    const { _id, userAccount, website, avatarUrl, followers, totalRaisedAmount, ...rest } =
      'toObject' in model ? model.toObject() : model;

    return {
      id: _id.toString(),
      userAccount: userAccount?.toString() ?? null,
      avatarUrl: avatarUrl ?? `/content/img/users/person.png`,
      website,
      websiteUrl: CharityService.websiteUrl(website),
      followers: followers.map((follower) => {
        return {
          user: follower.user,
          createdAt: follower.createdAt,
        };
      }),
      totalRaisedAmount: Dinero({
        currency: AppConfig.app.defaultCurrency as Dinero.Currency,
        amount: model.totalRaisedAmount,
      }),
      ...rest,
    };
  }
}
