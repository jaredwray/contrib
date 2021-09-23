import dayjs from 'dayjs';
import Dinero from 'dinero.js';
import { Storage } from '@google-cloud/storage';
import { ClientSession, Connection, ObjectId } from 'mongoose';

import { IInfluencer, InfluencerModel } from '../mongodb/InfluencerModel';
import { IAuctionModel } from '../../Auction/mongodb/AuctionModel';
import { UserAccountModel, IUserAccount } from '../../UserAccount/mongodb/UserAccountModel';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { CharityService } from '../../Charity';
import { InfluencerProfile } from '../dto/InfluencerProfile';
import { InfluencerStatus } from '../dto/InfluencerStatus';
import { InfluencerOrderBy } from '../dto/InfluencerOrderBy';
import { UpdateInfluencerProfileInput } from '../graphql/model/UpdateInfluencerProfileInput';
import { AppConfig } from '../../../config';
import { AppLogger } from '../../../logger';
import { AppError, ErrorCode } from '../../../errors';
import { objectTrimmer } from '../../../helpers/objectTrimmer';

interface TransientInfluencerInput {
  name: string;
}

export class InfluencerService {
  private readonly InfluencerModel = InfluencerModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);

  constructor(private readonly connection: Connection, private readonly charityService: CharityService) {}

  private ORDER_SORTS = {
    [InfluencerOrderBy.NAME_ASC]: { name: 'asc' },
    [InfluencerOrderBy.NAME_DESC]: { name: 'desc' },
    [InfluencerOrderBy.ONBOARDED_AT_ASC]: { onboardedAt: 'asc' },
    [InfluencerOrderBy.ONBOARDED_AT_DESC]: { onboardedAt: 'desc' },
    [InfluencerOrderBy.TOTALRAISEDAMOUNT_ASC]: { totalRaisedAmount: 'asc' },
    [InfluencerOrderBy.TOTALRAISEDAMOUNT_DESC]: { totalRaisedAmount: 'desc' },
  };

  public getSearchOptions({ query }) {
    return ([
      ['status', { status: { $in: InfluencerStatus.ONBOARDED } }],
      [query, { name: { $regex: (query || '').trim(), $options: 'i' } }],
    ] as [string, { [key: string]: any }][]).reduce(
      (hash, [condition, filters]) => ({ ...hash, ...(condition ? filters : {}) }),
      {},
    );
  }

  public getSortOptions(orderBy) {
    return this.ORDER_SORTS[orderBy];
  }

  public async getInfluencers({ filters, orderBy, skip = 0, size }) {
    const influencers = this.InfluencerModel.find(this.getSearchOptions(filters))
      .skip(skip)
      .limit(size)
      .sort(this.getSortOptions(orderBy));
    return await influencers.exec();
  }

  public async getInfluencersCount({ filters }) {
    return this.InfluencerModel.find(this.getSearchOptions(filters)).countDocuments().exec();
  }

  public async influencersList(params) {
    const items = await this.getInfluencers(params);
    const totalItems = await this.getInfluencersCount(params);

    return {
      totalItems,
      items: items.map((item) => InfluencerService.makeInfluencerProfile(item)),
      size: items.length,
      skip: params.skip || 0,
    };
  }

  async handleFollowLogicErrors(
    influencerId: string,
    accountId: string,
    session: ClientSession,
  ): Promise<{ account: IUserAccount; influencer: IInfluencer }> {
    const influencer = await this.InfluencerModel.findById(influencerId, null, { session }).exec();

    if (!influencer) {
      AppLogger.error(`Influencer record #${influencerId} not found`);
      throw new AppError('Something went wrong. Please, try later');
    }

    const account = await this.UserAccountModel.findById(accountId, null, { session }).exec();
    if (!account) {
      AppLogger.error(`Account record #${accountId} not found`);
      throw new AppError('Something went wrong. Please, try later');
    }

    return {
      account,
      influencer,
    };
  }

  async followInfluencer(influencerId: string, accountId: string) {
    const session = await this.connection.startSession();

    let returnObject = null;
    try {
      await session.withTransaction(async () => {
        const { account, influencer } = await this.handleFollowLogicErrors(influencerId, accountId, session);

        const currentAccountId = account._id.toString();
        const followed = influencer.followers.some((follower) => follower.user.toString() === currentAccountId);

        if (followed) {
          throw new AppError('You have already followed to this influencer');
        }

        const createdFollower = {
          user: currentAccountId,
          createdAt: dayjs(),
        };

        const influencerProfileId = influencer._id.toString();

        const createdFollowing = {
          influencerProfile: influencerProfileId,
          createdAt: dayjs(),
        };

        Object.assign(influencer, {
          followers: [...influencer.followers, createdFollower],
        });

        Object.assign(account, {
          followingInfluencers: [...account.followingInfluencers, createdFollowing],
        });

        await influencer.save({ session });
        await account.save({ session });

        returnObject = createdFollower;
      });
      return returnObject;
    } catch (error) {
      AppLogger.error(`Cannot follow Influencer with id #${influencerId}: ${error.message}`);
      throw new AppError('Something went wrong. Please, try later');
    } finally {
      session.endSession();
    }
  }

  async unfollowInfluencer(influencerId: string, accountId: string) {
    const session = await this.connection.startSession();

    let returnObject = null;
    try {
      await session.withTransaction(async () => {
        const { account, influencer } = await this.handleFollowLogicErrors(influencerId, accountId, session);

        const influencerProfileId = influencer._id.toString();

        account.followingInfluencers = account.followingInfluencers.filter(
          (follow) => follow?.influencerProfile?.toString() !== influencerProfileId,
        );

        const currentAccountId = account._id.toString();

        influencer.followers = influencer.followers.filter((follower) => follower.user.toString() !== currentAccountId);

        await influencer.save({ session });
        await account.save({ session });

        returnObject = { id: Date.now().toString() };
      });
      return returnObject;
    } catch (error) {
      AppLogger.error(`Cannot unfollow Influencer with id #${influencerId}: ${error.message}`);
      throw new AppError('Something went wrong. Please, try later');
    } finally {
      session.endSession();
    }
  }

  async createTransientInfluencer(
    { name }: TransientInfluencerInput,
    session?: ClientSession,
  ): Promise<InfluencerProfile> {
    const influencer = await this.InfluencerModel.create(
      [
        {
          name: name.trim(),
          avatarUrl: `/content/img/users/person.png`,
          status: InfluencerStatus.TRANSIENT,
          favoriteCharities: [],
          assistants: [],
        },
      ],
      { session },
    );
    return InfluencerService.makeInfluencerProfile(influencer[0]);
  }

  async findInfluencer(id: string, session?: ClientSession): Promise<InfluencerProfile | null> {
    try {
      const influencer = await this.InfluencerModel.findById(id, null, { session }).exec();
      return (influencer && InfluencerService.makeInfluencerProfile(influencer)) ?? null;
    } catch (error) {
      AppLogger.error(`Cannot find Influencer with id #${id}: ${error.message}`);
    }
  }

  async findInfluencerByUserAccount(userAccount: string): Promise<InfluencerProfile | null> {
    try {
      const influencer = await this.InfluencerModel.findOne({ userAccount }).exec();
      return (influencer && InfluencerService.makeInfluencerProfile(influencer)) ?? null;
    } catch (error) {
      AppLogger.error(`Cannot find Influencer with id #${userAccount}: ${error.message}`);
    }
  }
  async searchForInfluencer(query: string): Promise<InfluencerProfile[] | null> {
    if (!query) {
      return [];
    }
    const influencers = await this.InfluencerModel.find(InfluencerService.influencerSearchSelector(query));
    return influencers.map((influencer) => InfluencerService.makeInfluencerProfile(influencer));
  }
  private static influencerSearchSelector(query: string) {
    return { name: { $regex: query, $options: 'i' } };
  }

  async updateInfluencerStatus(
    profile: InfluencerProfile,
    status: InfluencerStatus,
    userAccount: UserAccount | null,
    session?: ClientSession,
  ): Promise<InfluencerProfile> {
    if (profile.status === status) {
      return profile;
    }

    const model = await this.InfluencerModel.findById(profile.id, null, { session }).exec();
    model.status = status;
    model.onboardedAt = dayjs().second(0);

    if (userAccount) {
      if (model.userAccount) {
        throw new Error('attempting to override user account for an influencer');
      }
      model.userAccount = userAccount.mongodbId;
    }

    await model.save();
    return InfluencerService.makeInfluencerProfile(model);
  }

  async listInfluencers(skip: number, size: number): Promise<InfluencerProfile[]> {
    const models = await this.InfluencerModel.find().skip(skip).limit(size).sort({ id: 'asc' }).exec();

    return models.map((m) => InfluencerService.makeInfluencerProfile(m));
  }

  async listInfluencersByUserAccountIds(userAccountIds: readonly string[]): Promise<InfluencerProfile[]> {
    const models = await this.InfluencerModel.find({ userAccount: { $in: userAccountIds } });
    return models.map((influencer) => InfluencerService.makeInfluencerProfile(influencer));
  }

  async countInfluencers(): Promise<number> {
    return this.InfluencerModel.countDocuments().exec();
  }

  async assignUserToInfluencer(
    id: ObjectId,
    userAccountId: string,
    session: ClientSession,
  ): Promise<InfluencerProfile> {
    const influencer = await this.InfluencerModel.findById(id, null, { session }).exec();
    if (!influencer) {
      throw new Error(`cannot assign user to influencer: influencer ${id} is not found`);
    }

    if (influencer.status !== InfluencerStatus.INVITATION_PENDING) {
      throw new Error(`cannot assign user to influencer: influencer ${id} status is ${influencer.status} `);
    }

    if (influencer.userAccount) {
      throw new Error(`cannot assign user to influencer: influencer ${id} already has a user account assigned`);
    }

    influencer.userAccount = userAccountId;
    influencer.status = InfluencerStatus.ONBOARDED;
    influencer.onboardedAt = dayjs().second(0);
    await influencer.save();

    return InfluencerService.makeInfluencerProfile(influencer);
  }

  async updateInfluencerProfileById(id: string, input: UpdateInfluencerProfileInput): Promise<InfluencerProfile> {
    const influencer = await this.InfluencerModel.findOne({ _id: id }).exec();
    if (!influencer) {
      throw new Error(`influencer record #${id} not found`);
    }

    Object.assign(influencer, objectTrimmer(input));

    await influencer.save();

    return InfluencerService.makeInfluencerProfile(influencer);
  }

  async updateInfluencerProfileAvatarById(id: string, image: any): Promise<InfluencerProfile> {
    const influencer = await this.InfluencerModel.findOne({ _id: id }).exec();
    if (!influencer) {
      throw new Error(`influencer record #${id} not found`);
    }

    const { filename: originalFilename, createReadStream } = await image;
    const ALLOWED_EXTENSIONS = ['png', 'jpeg', 'jpg', 'webp'];
    const extension = originalFilename.split('.').pop();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      AppLogger.error('File has unsupported extension: ', originalFilename);
      return;
    }

    const filename = `${influencer._id}/avatar/avatar.webp`;
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
              influencer.avatarUrl = `${bucketFullPath}/${filename}`;
              influencer.save();
            })
            .catch((e: any) => AppLogger.error(`exec error : ${e}`));
        }),
    );

    return InfluencerService.makeInfluencerProfile(influencer);
  }

  async updateInfluencerProfileFavoriteCharitiesById(id: string, charities: [string]): Promise<InfluencerProfile> {
    const influencer = await this.InfluencerModel.findOne({ _id: id }).exec();
    if (!influencer) {
      throw new Error(`influencer record #${id} not found`);
    }

    const favoriteCharities = await this.charityService.listCharitiesByIds(charities);
    influencer.favoriteCharities = favoriteCharities.map((m) => m.id);

    await influencer.save();

    return InfluencerService.makeInfluencerProfile(influencer);
  }

  /* TODO should be removed after new API integration */

  /* TODO block start */

  async updateInfluencerProfileByUserId(
    userAccount: string,
    input: UpdateInfluencerProfileInput,
  ): Promise<InfluencerProfile> {
    const influencer = await this.InfluencerModel.findOne({ userAccount }).exec();
    if (!influencer) {
      throw new Error(`influencer record not found for user account ${userAccount}`);
    }

    Object.assign(influencer, objectTrimmer(input));

    await influencer.save();

    return InfluencerService.makeInfluencerProfile(influencer);
  }

  async updateInfluencerProfileAvatarByUserId(userAccount: string, image: any): Promise<InfluencerProfile> {
    const influencer = await this.InfluencerModel.findOne({ userAccount }).exec();
    if (!influencer) {
      throw new Error(`influencer record not found for user account ${userAccount}`);
    }

    const { filename: originalFilename, createReadStream } = await image;
    const ALLOWED_EXTENSIONS = ['png', 'jpeg', 'jpg', 'webp'];
    const extension = originalFilename.split('.').pop();

    if (!ALLOWED_EXTENSIONS.includes(extension.toLowerCase())) {
      AppLogger.error('File has unsupported extension: ', originalFilename);
      return;
    }

    const filename = `${influencer._id}/avatar/avatar.webp`;
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
              influencer.avatarUrl = `${bucketFullPath}/${filename}`;
              influencer.save();
            })
            .catch((e: any) => AppLogger.error(`exec error : ${e}`));
        }),
    );

    return InfluencerService.makeInfluencerProfile(influencer);
  }

  async updateInfluencerProfileFavoriteCharitiesByUserId(
    userAccount: string,
    charities: [string],
  ): Promise<InfluencerProfile> {
    const influencer = await this.InfluencerModel.findOne({ userAccount }).exec();
    if (!influencer) {
      throw new Error(`influencer record not found for user account ${userAccount}`);
    }

    const favoriteCharities = await this.charityService.listCharitiesByIds(charities);
    influencer.favoriteCharities = favoriteCharities.map((m) => m.id);

    await influencer.save();

    return InfluencerService.makeInfluencerProfile(influencer);
  }

  /* TODO block end */

  async assignAssistantsToInfluencer(influencerId: string, assistantId: string): Promise<void> {
    await this.InfluencerModel.updateOne({ _id: influencerId }, { $addToSet: { assistants: assistantId } });
  }

  public static makeInfluencerProfile(model: IInfluencer): InfluencerProfile {
    const { _id, userAccount, favoriteCharities, assistants, followers, totalRaisedAmount, ...rest } =
      'toObject' in model ? model.toObject() : model;

    return {
      id: _id.toString(),
      userAccount: userAccount?.toString() ?? null,
      favoriteCharities: favoriteCharities?.map((favoriteCharitie) => favoriteCharitie.toString()) ?? [],
      assistants: assistants?.map((assistant) => assistant.toString()) ?? [],
      totalRaisedAmount: Dinero({
        currency: AppConfig.app.defaultCurrency as Dinero.Currency,
        amount: model.totalRaisedAmount,
      }),
      followers: followers.map((follower) => {
        return {
          user: follower.user,
          createdAt: follower.createdAt,
        };
      }),
      ...rest,
    };
  }
}
