import { ClientSession, Connection, FilterQuery, Query, Types } from 'mongoose';
import dayjs, { Dayjs } from 'dayjs';

import { ShortLinkService, ShortLinkModel } from '../../ShortLink';

import { InfluencerModel } from '../../Influencer/mongodb/InfluencerModel';
import { AuctionModel, IAuctionModel } from '../mongodb/AuctionModel';
import { AuctionAssetModel, IAuctionAssetModel } from '../mongodb/AuctionAssetModel';
import { CharityModel } from '../../Charity/mongodb/CharityModel';
import { UserAccountModel, IUserAccount } from '../../UserAccount/mongodb/UserAccountModel';

import { AuctionSearchFilters } from '../dto/AuctionSearchFilters';
import { AuctionOrderBy } from '../dto/AuctionOrderBy';
import { AuctionStatus } from '../dto/AuctionStatus';
import { IAuctionFilters, IAuctionRepository, ICreateAuction, IUpdateAuction } from './IAuctionRepoository';

import { AppError, ErrorCode } from '../../../errors';
import { AppLogger } from '../../../logger';
import { AppConfig } from '../../../config';

import { objectTrimmer } from '../../../helpers/objectTrimmer';
import { auctionDuration } from '../../../helpers/auctionDuration';

type ISearchFilter = { [key in AuctionOrderBy]: { [key: string]: string } };
type ISearchOptions = {
  [key: string]: FilterQuery<IAuctionModel>;
};

export class AuctionRepository implements IAuctionRepository {
  constructor(private readonly connection: Connection) {}

  private readonly shortLinkService = new ShortLinkService(this.connection);
  private readonly ShortLinkModel = ShortLinkModel(this.connection);
  private readonly AuctionModel = AuctionModel(this.connection);
  private readonly CharityModel = CharityModel(this.connection);
  private readonly InfluencerModel = InfluencerModel(this.connection);
  private readonly AuctionAsset = AuctionAssetModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);

  private static SEARCH_FILTERS: ISearchFilter = {
    [AuctionOrderBy.CREATED_AT_DESC]: { startsAt: 'asc' },
    [AuctionOrderBy.TIME_ASC]: { endsAt: 'asc' },
    [AuctionOrderBy.TIME_DESC]: { endsAt: 'desc' },
    [AuctionOrderBy.PRICE_ASC]: { currentPrice: 'asc' },
    [AuctionOrderBy.PRICE_DESC]: { currentPrice: 'desc' },
  };

  private get auctionPopulateOpts() {
    return [
      { path: 'assets', model: this.AuctionAsset },
      { path: 'auctionOrganizer', model: this.InfluencerModel },
      { path: 'auctionOrganizer', populate: { path: 'followers.user', model: this.UserAccountModel } },
      { path: 'charity', model: this.CharityModel },
      { path: 'charity', populate: { path: 'followers.user', model: this.UserAccountModel } },
      { path: 'winner', model: this.UserAccountModel },
      { path: 'shortLink', model: this.ShortLinkModel },
    ];
  }

  private static searchSortOptionsByName(
    name: string = AuctionOrderBy.CREATED_AT_DESC,
    statusFilter: string[],
    filters: AuctionSearchFilters,
  ): { [key: string]: string } {
    if (
      statusFilter == [AuctionStatus.SOLD, AuctionStatus.SETTLED] ||
      name == AuctionOrderBy.PRICE_ASC ||
      name == AuctionOrderBy.PRICE_DESC ||
      (filters?.winner && AuctionOrderBy.TIME_DESC)
    ) {
      return AuctionRepository.SEARCH_FILTERS[name];
    }
    return Object.assign({ status: 'asc' }, AuctionRepository.SEARCH_FILTERS[name]);
  }

  private populateAuctionQuery<T>(query: Query<T, IAuctionModel>): Query<T, IAuctionModel> {
    for (let i = 0; i < this.auctionPopulateOpts.length; i++) {
      query.populate(this.auctionPopulateOpts[i]);
    }
    return query;
  }

  private populateAuctionModel(model: IAuctionModel): IAuctionModel {
    for (let i = 0; i < this.auctionPopulateOpts.length; i++) {
      model.populate(this.auctionPopulateOpts[i]);
    }
    return model;
  }

  private static getSearchOptions(
    query: string | null,
    filters: AuctionSearchFilters | null,
    statusFilter: string[],
  ): ISearchOptions {
    return ([
      [!filters?.all, { password: { $exists: false } }],
      [statusFilter, { status: { $in: statusFilter } }],
      [query, { title: { $regex: (query || '').trim(), $options: 'i' } }],
      [filters?.maxPrice, { currentPrice: { $gte: filters?.minPrice, $lte: filters?.maxPrice } }],
      [filters?.auctionOrganizer, { auctionOrganizer: filters?.auctionOrganizer }],
      [filters?.charity?.length, { charity: { $in: filters?.charity?.map((id: string) => Types.ObjectId(id)) } }],
      [filters?.status, { status: { $in: filters?.status } }],
      [filters?.selectedAuction, { _id: { $ne: filters?.selectedAuction } }],
      [filters?.winner, { winner: filters?.winner }],
      [filters?.ids?.length, { _id: { $in: filters?.ids?.map((id: string) => Types.ObjectId(id)) } }],
    ] as [string, { [key: string]: any }][]).reduce(
      (hash, [condition, filters]) => ({ ...hash, ...(condition ? filters : {}) }),
      {},
    );
  }

  public async handleFollowLogicErrors(
    auctionId: string,
    accountId: string,
    session: ClientSession,
  ): Promise<{ account: IUserAccount; auction: IAuctionModel }> {
    const auction = await this.AuctionModel.findById(auctionId, null, { session }).exec();
    if (!auction) {
      AppLogger.error(`Auction record #${auctionId} not found`);
      throw new AppError('Something went wrong. Please, try later');
    }

    const account = await this.UserAccountModel.findById(accountId, null, { session }).exec();
    if (!account) {
      AppLogger.error(`Account record #${accountId} not found`);
      throw new AppError('Something went wrong. Please, try later');
    }

    return { account, auction };
  }

  public async followAuction(auctionId: string, accountId: string): Promise<{ user: string; createdAt: Dayjs } | null> {
    const session = await this.connection.startSession();

    let returnObject = null;
    try {
      await session.withTransaction(async () => {
        const { auction, account } = await this.handleFollowLogicErrors(auctionId, accountId, session);

        const createdFollower = {
          user: account._id.toString(),
          createdAt: dayjs(),
        };
        const createdFollowing = {
          auction: auction._id.toString(),
          createdAt: dayjs(),
        };

        Object.assign(auction, {
          followers: [...auction.followers, createdFollower],
        });
        Object.assign(account, {
          followingAuctions: [...account.followingAuctions, createdFollowing],
        });

        await auction.save({ session });
        await account.save({ session });

        returnObject = createdFollower;
      });

      return returnObject;
    } catch (error) {
      AppLogger.error(`Cannot follow Auction with id #${auctionId}: ${error.message}`);
      throw new Error('Something went wrong. Please, try later');
    } finally {
      session.endSession();
    }
  }

  public async unfollowAuction(auctionId: string, accountId: string): Promise<{ id: string }> | null {
    const session = await this.connection.startSession();

    let returnObject = null;
    try {
      await session.withTransaction(async () => {
        const { auction, account } = await this.handleFollowLogicErrors(auctionId, accountId, session);

        const currentAccountId = account._id.toString();

        account.followingAuctions = account.followingAuctions.filter(
          (follow) => follow.auction.toString() !== auctionId,
        );
        auction.followers = auction.followers.filter((follower) => follower.user.toString() !== currentAccountId);

        await auction.save({ session });
        await account.save({ session });

        returnObject = { id: Date.now().toString() };
      });

      return returnObject;
    } catch (error) {
      AppLogger.error(`Cannot unfollow Auction with id #${auctionId}: ${error.message}`);
      throw new Error('Something went wrong. Please, try later');
    } finally {
      session.endSession();
    }
  }

  async createAuction(organizerId: string, input: ICreateAuction): Promise<IAuctionModel> {
    if (!input.title) {
      throw new AppError('Cannot create auction without title', ErrorCode.BAD_REQUEST);
    }

    const utcCurrentDate = dayjs().second(0);
    const utcCurrentDateISO = utcCurrentDate.toISOString();

    const [auction] = await this.AuctionModel.create([
      {
        ...objectTrimmer(input),
        startsAt: utcCurrentDateISO,
        endsAt: utcCurrentDate.add(3, 'days').toISOString(),
        createdAt: utcCurrentDateISO,
        updatedAt: utcCurrentDateISO,
        auctionOrganizer: Types.ObjectId(organizerId),
        startPrice: input.startPrice?.getAmount(),
        currentPrice: input.startPrice?.getAmount(),
        itemPrice: input.itemPrice?.getAmount(),
        priceCurrency: input.startPrice?.getCurrency(),
      },
    ]);

    const shortLink = await this.shortLinkService.createShortLink({ address: `auctions/${auction._id.toString()}` });

    Object.assign(auction, { shortLink: shortLink.id });

    await auction.save();

    AppLogger.info(`createAuction method called for #${auction._id.toString()} auction;`);
    AppLogger.info(
      `date values: ${JSON.stringify({
        ['when auction creating']: {
          ['new Date']: new Date(),
          ['startsAt , createdAt, updatedAt']: utcCurrentDateISO,
          endsAt: utcCurrentDate.add(3, 'days').toISOString(),
        },
        ['when auction created']: {
          startsAt: auction.startsAt,
          createdAt: auction.createdAt,
          updatedAt: auction.updatedAt,
          endsAt: auction.endsAt,
        },
      })}`,
    );

    return this.populateAuctionModel(auction).execPopulate();
  }

  public async getPopulatedAuction(auction: IAuctionModel) {
    try {
      return this.populateAuctionModel(auction).execPopulate();
    } catch (error) {
      throw new AppError(
        `Cannot populate auction model #${auction._id.toString()} with error: ${error.message}`,
        ErrorCode.BAD_REQUEST,
      );
    }
  }

  public async getAuctionOrganizerUserAccountFromAuction(auction: IAuctionModel) {
    try {
      return auction
        .populate({ path: 'auctionOrganizer', model: this.InfluencerModel })
        .populate({ path: 'auctionOrganizer', populate: { path: 'userAccount', model: this.UserAccountModel } })
        .populate({ path: 'shortLink', model: this.ShortLinkModel })
        .execPopulate();
    } catch (error) {
      throw new AppError(
        `Cannot populate auction model #${auction._id.toString()} with error: ${error.message}`,
        ErrorCode.BAD_REQUEST,
      );
    }
  }

  async activateAuction(id: string, organizerId: string): Promise<IAuctionModel> {
    const auction = await this.findAuction(id, organizerId);

    if (![AuctionStatus.DRAFT, AuctionStatus.STOPPED].includes(auction?.status)) {
      throw new AppError(`Cannot activate auction with ${auction.status} status`, ErrorCode.BAD_REQUEST);
    }

    AppLogger.info(`activateAuction method called for #${id} auction;`);

    const duration = auctionDuration({ startsAt: auction.startsAt, endsAt: auction.endsAt });

    const utcCurrentTime = dayjs().second(0);

    Object.assign(auction, {
      startsAt: utcCurrentTime.toISOString(),
      endsAt: utcCurrentTime.add(duration, 'days').toISOString(),
      status: AuctionStatus.ACTIVE,
    });

    const updatedAuction = await auction.save();

    AppLogger.info(
      `date values: ${JSON.stringify({
        ['before auction update']: {
          ['new Date']: new Date(),
          utcCurrentTime,
          startsAt: auction.startsAt,
          endsAt: auction.endsAt,
          duration,
        },
        ['auction updated']: {
          startsAt: updatedAuction.startsAt,
          endsAt: updatedAuction.endsAt,
          duration: updatedAuction.endsAt.diff(updatedAuction.startsAt, 'days'),
        },
      })}`,
    );

    return this.populateAuctionModel(updatedAuction).execPopulate();
  }

  async updateAuction(
    id: string,
    organizerId: string,
    input: IUpdateAuction,
    isAdmin: boolean,
  ): Promise<IAuctionModel> {
    const auction = await this.findAuction(id, input.organizerId || organizerId);

    if (
      [AuctionStatus.SETTLED, AuctionStatus.FAILED, AuctionStatus.SOLD].includes(auction.status) ||
      (auction.status === AuctionStatus.ACTIVE && !isAdmin)
    ) {
      throw new AppError(`Cannot update auction with ${auction.status} status`, ErrorCode.BAD_REQUEST);
    }

    Object.assign(auction, input);
    const updatedAuction = await auction.save();
    return this.populateAuctionModel(updatedAuction).execPopulate();
  }

  async getAuction(id: string, organizerId?: string): Promise<IAuctionModel> {
    const organizerOpts = organizerId ? { auctionOrganizer: Types.ObjectId(organizerId) } : {};
    return this.populateAuctionQuery<IAuctionModel>(this.AuctionModel.findOne({ _id: id, ...organizerOpts })).exec();
  }

  async countAuctions({
    query,
    filters,
    statusFilter,
  }: {
    query?: string;
    filters?: AuctionSearchFilters;
    statusFilter: string[];
  }): Promise<number> {
    return this.AuctionModel.find(AuctionRepository.getSearchOptions(query, filters, statusFilter))
      .countDocuments()
      .exec();
  }

  async getAuctions({
    query,
    size,
    skip = 0,
    orderBy,
    filters,
    statusFilter,
  }: IAuctionFilters): Promise<IAuctionModel[]> {
    const auctions = this.populateAuctionQuery<IAuctionModel[]>(
      this.AuctionModel.find(AuctionRepository.getSearchOptions(query, filters, statusFilter)),
    )
      .skip(skip)
      .limit(size)
      .sort(AuctionRepository.searchSortOptionsByName(orderBy, statusFilter, filters));
    return await auctions.exec();
  }

  async getAuctionsCount({ query, filters, statusFilter }: IAuctionFilters): Promise<number> {
    return this.populateAuctionQuery<IAuctionModel[]>(
      this.AuctionModel.find(AuctionRepository.getSearchOptions(query, filters, statusFilter)),
    )
      .countDocuments()
      .exec();
  }

  async getAuctionPriceLimits({ query, filters, statusFilter }): Promise<{ min: number; max: number }> {
    const searchOptions = AuctionRepository.getSearchOptions(query, filters, statusFilter);
    const result: { min: number; max: number }[] = await this.AuctionModel.aggregate([
      {
        $match: {
          ...searchOptions,
        },
      },
      {
        $group: {
          _id: null,
          min: { $min: '$currentPrice' },
          max: { $max: '$currentPrice' },
        },
      },
    ]);

    return result?.length ? result[0] : { min: 0, max: 0 };
  }

  public getInfluencersAuctions(id: string): Promise<IAuctionModel[]> {
    return this.populateAuctionQuery(this.AuctionModel.find({ auctionOrganizer: Types.ObjectId(id) })).exec();
  }

  async addAuctionAttachment(id: string, asset: IAuctionAssetModel): Promise<IAuctionAssetModel> {
    const auction = await this.getAuction(id);
    auction.assets.push(asset);
    await auction.save();
    return asset;
  }

  private async findAuction(id: string, organizerId?: string): Promise<IAuctionModel> {
    const organizerOpts = organizerId ? { auctionOrganizer: Types.ObjectId(organizerId) } : {};
    const auction = await this.AuctionModel.findOne({ _id: id, ...organizerOpts }).exec();

    if (!auction) {
      throw new AppError('Auction not found', ErrorCode.NOT_FOUND);
    }

    return auction;
  }
}
