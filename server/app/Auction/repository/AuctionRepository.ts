import { Connection, FilterQuery, Query, Types } from 'mongoose';

import { AuctionModel, IAuctionModel } from '../mongodb/AuctionModel';
import { AuctionAssetModel, IAuctionAssetModel } from '../mongodb/AuctionAssetModel';
import { CharityModel } from '../../Charity/mongodb/CharityModel';
import { AuctionBidModel } from '../mongodb/AuctionBidModel';
import { InfluencerModel } from '../../Influencer/mongodb/InfluencerModel';
import { UserAccountModel } from '../../UserAccount/mongodb/UserAccountModel';

import { AuctionInput } from '../graphql/model/AuctionInput';
import { AppError, ErrorCode } from '../../../errors';
import { AuctionSearchFilters } from '../dto/AuctionSearchFilters';
import { AuctionOrderBy } from '../dto/AuctionOrderBy';
import { AuctionStatus } from '../dto/AuctionStatus';
import { IAuctionFilters, IAuctionRepository, IUpdateAuction } from './IAuctionRepoository';

type ISearchFilter = { [key in AuctionOrderBy]: { [key: string]: string } };
type ISearchOptions = {
  [key: string]: FilterQuery<IAuctionModel>;
};

export class AuctionRepository implements IAuctionRepository {
  constructor(private readonly connection: Connection) {}

  private readonly AuctionModel = AuctionModel(this.connection);
  private readonly CharityModel = CharityModel(this.connection);
  private readonly AuctionBidModel = AuctionBidModel(this.connection);
  private readonly InfluencerModel = InfluencerModel(this.connection);
  private readonly AuctionAsset = AuctionAssetModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);

  private static SEARCH_FILTERS: ISearchFilter = {
    [AuctionOrderBy.CREATED_AT_DESC]: { startsAt: 'desc' },
    [AuctionOrderBy.TIME_ASC]: { endsAt: 'asc' },
    [AuctionOrderBy.TIME_DESC]: { endsAt: 'desc' },
    [AuctionOrderBy.SPORT]: { sport: 'asc' },
    [AuctionOrderBy.PRICE_ASC]: { startPrice: 'asc' },
    [AuctionOrderBy.PRICE_DESC]: { startPrice: 'desc' },
  };

  private get auctionPopulateOpts() {
    return [
      { path: 'charity', model: this.CharityModel },
      { path: 'assets', model: this.AuctionAsset },
      { path: 'auctionOrganizer', mode: this.InfluencerModel },
      { path: 'maxBid', model: this.AuctionBidModel },
      {
        path: 'bids',
        model: this.AuctionBidModel,
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
      [filters?.maxPrice, { startPrice: { $lte: filters?.maxPrice } }],
      [filters?.minPrice, { startPrice: { $gte: filters?.minPrice } }],
      [filters?.auctionOrganizer, { auctionOrganizer: filters?.auctionOrganizer }],
    ] as [string, { [key: string]: any }][]).reduce(
      (hash, [condition, filters]) => ({ ...hash, ...(condition ? filters : {}) }),
      {
        status: { $eq: AuctionStatus.ACTIVE },
      },
    );
  }

  async createAuction(organizerId: string, { charity: _, ...input }: AuctionInput): Promise<IAuctionModel> {
    if (!input.title) {
      throw new AppError('Cannot create auction without title', ErrorCode.BAD_REQUEST);
    }
    const [auction] = await this.AuctionModel.create([{ ...input, auctionOrganizer: Types.ObjectId(organizerId) }]);
    return this.populateAuctionModel(auction).execPopulate();
  }

  async changeAuctionStatus(id: string, organizerId: string, status: AuctionStatus): Promise<IAuctionModel> {
    const auction = await this.AuctionModel.findOne({ _id: id, auctionOrganizer: organizerId }).exec();
    if (!auction) {
      throw new AppError('Auction not found', ErrorCode.NOT_FOUND);
    }
    if (auction.status === AuctionStatus.ACTIVE && status === AuctionStatus.DRAFT) {
      throw new AppError('Cannot set active auction to DRAFT status', ErrorCode.BAD_REQUEST);
    }
    auction.status = status;
    const updatedAuction = await auction.save();
    return this.populateAuctionModel(updatedAuction).execPopulate();
  }

  async updateAuction(id: string, organizerId: string, input: IUpdateAuction): Promise<IAuctionModel> {
    const auction = await this.AuctionModel.findOne({ _id: id, auctionOrganizer: organizerId }).exec();
    if (!auction) {
      throw new AppError('Auction not found', ErrorCode.NOT_FOUND);
    }
    if (auction.status !== AuctionStatus.DRAFT) {
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

  async countAuctions({ query, filters }: { query?: string; filters?: AuctionSearchFilters }): Promise<number> {
    return this.AuctionModel.find(AuctionRepository.getSearchOptions(query, filters)).countDocuments().exec();
  }

  async getAuctions({ query, size, skip = 0, orderBy, filters }: IAuctionFilters): Promise<IAuctionModel[]> {
    const auctions = this.populateAuctionQuery<IAuctionModel[]>(
      this.AuctionModel.find(AuctionRepository.getSearchOptions(query, filters)),
    )
      .skip(skip)
      .sort(AuctionRepository.searchSortOptionsByName(orderBy));
    if (size) {
      auctions.limit(size);
    }
    return auctions.exec();
  }

  async getAuctionsCount({ query, size, skip = 0, orderBy, filters }: IAuctionFilters): Promise<number> {
    return this.populateAuctionQuery<IAuctionModel[]>(
      this.AuctionModel.find(AuctionRepository.getSearchOptions(query, filters)),
    )
      .skip(skip)
      .limit(size)
      .sort(AuctionRepository.searchSortOptionsByName(orderBy))
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
          min: { $min: '$startPrice' },
          max: { $max: '$startPrice' },
        },
      },
    ]);
    if (!result || !result.length) {
      throw new AppError('Cannot get min/max price limits', ErrorCode.NOT_FOUND);
    }
    return { min: result[0]?.min || 0, max: result[0]?.max || 0 };
  }

  public getInfluencersAuctions(id: string): Promise<IAuctionModel[]> {
    return this.AuctionModel.find({ auctionOrganizer: Types.ObjectId(id) }).exec();
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
}
