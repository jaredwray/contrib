import * as dayjs from 'dayjs';
import { Types } from 'mongoose';

import { AuctionInput } from '../graphql/model/AuctionInput';
import { IAuctionModel } from '../mongodb/AuctionModel';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionSearchFilters } from '../dto/AuctionSearchFilters';
import { AuctionOrderBy } from '../dto/AuctionOrderBy';
import { IAuctionAssetModel } from '../mongodb/AuctionAssetModel';

export type IAuctionFilters = {
  size: number;
  skip: number;
  query?: string;
  filters?: AuctionSearchFilters;
  orderBy?: AuctionOrderBy;
};

export type IUpdateAuction = {
  startPriceCurrency?: string;
  startPrice?: number;
  title?: string;
  sport?: string;
  gameWorn?: boolean;
  autographed?: boolean;
  fullPageDescription?: string;
  charity?: Types.ObjectId;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  playedIn?: string;
};

export interface IAuctionRepository {
  createAuction(organizerId: string, { charity: _, ...input }: AuctionInput): Promise<IAuctionModel>;
  changeAuctionStatus(id: string, organizerId: string, status: AuctionStatus): Promise<IAuctionModel>;
  updateAuction(id: string, organizerId: string, input: IUpdateAuction): Promise<IAuctionModel>;
  getAuctionPriceLimits(): Promise<{ min: number; max: number }>;
  countAuctions({ query, filters }: { query?: string; filters?: AuctionSearchFilters }): Promise<number>;
  getAuctions({ query, size, skip, orderBy, filters }: IAuctionFilters): Promise<IAuctionModel[]>;
  getAuctionsCount({ query, size, skip, orderBy, filters }: IAuctionFilters): Promise<number>;
  getAuction(id: string, organizerId?: string): Promise<IAuctionModel>;
  getAuctionSports(): Promise<string[]>;
  addAuctionAttachment(id: string, organizerId: string, asset: IAuctionAssetModel): Promise<IAuctionAssetModel>;
}
