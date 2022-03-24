import dayjs, { Dayjs } from 'dayjs';
import { Types } from 'mongoose';
import { IAuctionModel, IAuctionItem } from '../mongodb/AuctionModel';
import { AuctionSearchFilters } from '../dto/AuctionSearchFilters';
import { AuctionOrderBy } from '../dto/AuctionOrderBy';
import { IAuctionAssetModel } from '../mongodb/AuctionAssetModel';

export type IAuctionFilters = {
  size?: number;
  skip?: number;
  query?: string;
  filters?: AuctionSearchFilters;
  orderBy?: AuctionOrderBy;
  auctionOrganizer?: string;
  statusFilter?: string[];
};

export interface ICreateAuction {
  title?: string;
  description?: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
  startPrice?: Dinero.Dinero;
  itemPrice?: Dinero.Dinero;
  organizerId?: string;
}

export type IUpdateAuction = {
  itemPrice?: number;
  priceCurrency?: string;
  startPrice?: number;
  title?: string;
  description?: string;
  password?: string;
  charity?: Types.ObjectId;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  organizerId?: string;
  fairMarketValue?: number;
  items?: IAuctionItem[];
};

export interface IAuctionRepository {
  createAuction(organizerId: string, input: ICreateAuction): Promise<IAuctionModel>;
  activateAuction(id: string, organizerId: string): Promise<IAuctionModel>;
  updateAuction(id: string, organizerId: string, input: IUpdateAuction, isAdmin: boolean): Promise<IAuctionModel>;
  getAuctionPriceLimits({ query, statusFilter, filters }: IAuctionFilters): Promise<{ min: number; max: number }>;
  countAuctions({ query, filters }: { query?: string; filters?: AuctionSearchFilters }): Promise<number>;
  getAuctions({ query, size, skip, orderBy, filters }: IAuctionFilters): Promise<IAuctionModel[]>;
  getAuctionsCount({ query, size, skip, orderBy, filters }: IAuctionFilters): Promise<number>;
  getAuction(id: string, organizerId?: string): Promise<IAuctionModel>;
  addAuctionAttachment(
    id: string,
    asset: IAuctionAssetModel,
    uid: string,
    filename: string,
  ): Promise<IAuctionAssetModel>;
  getInfluencersAuctions(id: string): Promise<IAuctionModel[]>;
  getPopulatedAuction(auction: IAuctionModel): Promise<IAuctionModel>;
  getAuctionOrganizerUserAccountFromAuction(auction: IAuctionModel): Promise<IAuctionModel>;
  followAuction(auctionId: string, accountId: string): Promise<{ user: string; createdAt: Dayjs } | null>;
  unfollowAuction(auctionId: string, accountId: string): Promise<{ id: string }> | null;
}
