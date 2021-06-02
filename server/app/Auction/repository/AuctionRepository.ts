import { Connection, FilterQuery, Query, Types } from 'mongoose';
import dayjs from 'dayjs';

import { AuctionModel, IAuctionModel } from '../mongodb/AuctionModel';
import { AuctionAssetModel, IAuctionAssetModel } from '../mongodb/AuctionAssetModel';
import { CharityModel } from '../../Charity/mongodb/CharityModel';
import { InfluencerModel } from '../../Influencer/mongodb/InfluencerModel';
import { UserAccountModel } from '../../UserAccount/mongodb/UserAccountModel';
import { AppError, ErrorCode } from '../../../errors';
import { AuctionSearchFilters } from '../dto/AuctionSearchFilters';
import { AuctionOrderBy } from '../dto/AuctionOrderBy';
import { AuctionStatus } from '../dto/AuctionStatus';
import { IAuctionFilters, IAuctionRepository, ICreateAuction, IUpdateAuction } from './IAuctionRepoository';

type ISearchFilter = { [key in AuctionOrderBy]: { [key: string]: string } };
type ISearchOptions = {
  [key: string]: FilterQuery<IAuctionModel>;
};

export class AuctionRepository implements IAuctionRepository {
  constructor(private readonly connection: Connection) {}

  private readonly AuctionModel = AuctionModel(this.connection);
  private readonly CharityModel = CharityModel(this.connection);
  private readonly InfluencerModel = InfluencerModel(this.connection);
  private readonly AuctionAsset = AuctionAssetModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);

  private static SEARCH_FILTERS: ISearchFilter = {
    [AuctionOrderBy.CREATED_AT_DESC]: { startsAt: 'asc' },
    [AuctionOrderBy.TIME_ASC]: { endsAt: 'asc' },
    [AuctionOrderBy.TIME_DESC]: { endsAt: 'desc' },
    [AuctionOrderBy.SPORT]: { sport: 'asc' },
    [AuctionOrderBy.PRICE_ASC]: { currentPrice: 'asc' },
    [AuctionOrderBy.PRICE_DESC]: { currentPrice: 'desc' },
  };

  private get auctionPopulateOpts() {
    return [
      { path: 'charity', model: this.CharityModel },
      { path: 'assets', model: this.AuctionAsset },
      { path: 'auctionOrganizer', model: this.InfluencerModel },
      {
        path: 'bids',
        populate: { path: 'user', model: this.UserAccountModel, select: ['_id'] },
      },
    ];
  }

  private static searchSortOptionsByName(name: string = AuctionOrderBy.CREATED_AT_DESC): { [key: string]: string } {
    return AuctionRepository.SEARCH_FILTERS[name];
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

  private static getSearchOptions(query: string | null, filters: AuctionSearchFilters | null): ISearchOptions {
    return ([
      [query, { title: { $regex: (query || '').trim(), $options: 'i' } }],
      [filters?.sports?.length, { sport: { $in: filters?.sports } }],
      [filters?.maxPrice, { currentPrice: { $gte: filters?.minPrice, $lte: filters?.maxPrice } }],
      [filters?.auctionOrganizer, { auctionOrganizer: filters?.auctionOrganizer }],
      [filters?.charity, { charity: filters?.charity }],
      [filters?.status, { status: { $in: filters?.status } }],
    ] as [string, { [key: string]: any }][]).reduce(
      (hash, [condition, filters]) => ({ ...hash, ...(condition ? filters : {}) }),
      {},
    );
  }

  async createAuction(organizerId: string, input: ICreateAuction): Promise<IAuctionModel> {
    if (!input.title) {
      throw new AppError('Cannot create auction without title', ErrorCode.BAD_REQUEST);
    }

    const [auction] = await this.AuctionModel.create([
      {
        ...input,
        auctionOrganizer: Types.ObjectId(organizerId),
        startPrice: input.startPrice?.getAmount(),
        currentPrice: input.startPrice?.getAmount(),
        startPriceCurrency: input.startPrice?.getCurrency(),
        currentPriceCurrency: input.startPrice?.getCurrency(),
      },
    ]);

    return this.populateAuctionModel(auction).execPopulate();
  }

  async activateAuction(id: string, organizerId: string): Promise<IAuctionModel> {
    const auction = await this.findAuction(id, organizerId);

    if (![AuctionStatus.DRAFT, AuctionStatus.PENDING].includes(auction?.status)) {
      throw new AppError(`Cannot activate auction with ${auction.status} status`, ErrorCode.BAD_REQUEST);
    }

    auction.status = dayjs().utc().isAfter(auction.startsAt) ? AuctionStatus.ACTIVE : AuctionStatus.PENDING;
    const updatedAuction = await auction.save();
    return this.populateAuctionModel(updatedAuction).execPopulate();
  }

  async updateAuction(id: string, organizerId: string, input: IUpdateAuction): Promise<IAuctionModel> {
    const auction = await this.findAuction(id, input.organizerId || organizerId);

    if (auction.status !== AuctionStatus.DRAFT && auction.status !== AuctionStatus.PENDING && !input.fairMarketValue) {
      throw new AppError(`Cannot update auction with ${auction.status} status`, ErrorCode.BAD_REQUEST);
    }
    Object.assign(auction, input);
    const updatedAuction = await auction.save();
    return this.populateAuctionModel(updatedAuction).execPopulate();
  }

  async updateAuctionLink(id: string, link: string): Promise<IAuctionModel> {
    const auction = await this.getAuction(id);
    auction.link = link;
    return auction.save();
  }

  async getAuction(id: string, organizerId?: string): Promise<IAuctionModel> {
    const organizerOpts = organizerId ? { auctionOrganizer: Types.ObjectId(organizerId) } : {};
    return this.populateAuctionQuery<IAuctionModel>(this.AuctionModel.findOne({ _id: id, ...organizerOpts })).exec();
  }

  async countAuctions({ query, filters }: { query?: string; filters?: AuctionSearchFilters }): Promise<number> {
    return this.AuctionModel.find(AuctionRepository.getSearchOptions(query, filters)).countDocuments().exec();
  }

  async getAuctions({ query, size, skip = 0, orderBy, filters }: IAuctionFilters): Promise<IAuctionModel[]> {
    if (orderBy === AuctionOrderBy.CREATED_AT_DESC) {
      const activeAuctions = this.populateAuctionQuery<IAuctionModel[]>(
        this.AuctionModel.find(AuctionRepository.getSearchOptions(query, filters)),
      )
        .skip(skip)
        .find({ status: AuctionStatus.ACTIVE })
        .sort(AuctionRepository.searchSortOptionsByName(orderBy));
      const pendingAuctions = this.populateAuctionQuery<IAuctionModel[]>(
        this.AuctionModel.find(AuctionRepository.getSearchOptions(query, filters)),
      )
        .skip(skip)
        .find({ status: AuctionStatus.PENDING })
        .sort(AuctionRepository.searchSortOptionsByName(orderBy));
      const settledAuctions = this.populateAuctionQuery<IAuctionModel[]>(
        this.AuctionModel.find(AuctionRepository.getSearchOptions(query, filters)),
      )
        .skip(skip)
        .find({ status: AuctionStatus.SETTLED })
        .sort(AuctionRepository.searchSortOptionsByName(orderBy));
      return (await activeAuctions.exec()).concat(await pendingAuctions.exec()).concat(await settledAuctions.exec());
    }
    if (orderBy === AuctionOrderBy.TIME_ASC) {
      const endedSoonAuctions = this.populateAuctionQuery<IAuctionModel[]>(
        this.AuctionModel.find(AuctionRepository.getSearchOptions(query, filters)),
      )
        .skip(skip)
        .sort(AuctionRepository.searchSortOptionsByName(orderBy));
      const settledAuctions = this.populateAuctionQuery<IAuctionModel[]>(
        this.AuctionModel.find(AuctionRepository.getSearchOptions(query, filters)),
      )
        .skip(skip)
        .find({ status: AuctionStatus.SETTLED })
        .sort(AuctionRepository.searchSortOptionsByName(orderBy));
      return (await endedSoonAuctions.exec())
        .filter((x) => x.status !== AuctionStatus.FAILED && x.status !== AuctionStatus.SETTLED)
        .concat(await settledAuctions.exec());
    }
    const auctions = this.populateAuctionQuery<IAuctionModel[]>(
      this.AuctionModel.find(AuctionRepository.getSearchOptions(query, filters)),
    )
      .skip(skip)
      .sort(AuctionRepository.searchSortOptionsByName(orderBy));
    return (await auctions.exec()).filter((x) => x.status !== AuctionStatus.FAILED);
  }

  async getAuctionsCount({ query, size, skip = 0, orderBy, filters }: IAuctionFilters): Promise<number> {
    return this.populateAuctionQuery<IAuctionModel[]>(
      this.AuctionModel.find(AuctionRepository.getSearchOptions(query, filters)),
    )
      .countDocuments()
      .exec();
  }

  async getAuctionPriceLimits(): Promise<{ min: number; max: number }> {
    const result: { min: number; max: number }[] = await this.AuctionModel.aggregate([
      {
        $match: {
          status: { $eq: AuctionStatus.ACTIVE },
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
    if (!result || !result.length) {
      throw new AppError('Cannot get min/max price limits', ErrorCode.NOT_FOUND);
    }
    return { min: result[0]?.min || 0, max: result[0]?.max || 0 };
  }

  public getInfluencersAuctions(id: string): Promise<IAuctionModel[]> {
    return this.populateAuctionQuery(this.AuctionModel.find({ auctionOrganizer: Types.ObjectId(id) })).exec();
  }

  public getAuctionSports(): Promise<string[]> {
    return this.AuctionModel.distinct('sport', { status: AuctionStatus.ACTIVE }).exec();
  }

  async addAuctionAttachment(id: string, organizerId: string, asset: IAuctionAssetModel): Promise<IAuctionAssetModel> {
    const auction = await this.getAuction(id, organizerId);
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
