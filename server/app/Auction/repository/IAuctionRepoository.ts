import dayjs, { Dayjs } from 'dayjs';
import { Types } from 'mongoose';
import { IAuctionModel } from '../mongodb/AuctionModel';
import { AuctionSearchFilters } from '../dto/AuctionSearchFilters';
import { AuctionOrderBy } from '../dto/AuctionOrderBy';
import { IAuctionAssetModel } from '../mongodb/AuctionAssetModel';
import { IUserAccount } from '../../UserAccount/mongodb/UserAccountModel';

export type IAuctionFilters = {
  size?: number;
  skip?: number;
  query?: string;
  filters?: AuctionSearchFilters;
  orderBy?: AuctionOrderBy;
  auctionOrganizer?: string;
  statusFilter: string[];
};

export interface ICreateAuction {
  title?: string;
  sport?: string;
  gameWorn?: boolean;
  autographed?: boolean;
  description?: string;
  fullPageDescription?: string;
  startDate?: Dayjs;
  timeZone?: string;
  endDate?: Dayjs;
  startPrice?: Dinero.Dinero;
  itemPrice?: Dinero.Dinero;
  playedIn?: string;
  organizerId?: string;
}

export type IUpdateAuction = {
  itemPrice?: number;
  priceCurrency?: string;
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
  organizerId?: string;
  fairMarketValue?: number;
  timeZone?: string;
};

export interface IAuctionRepository {
  createAuction(organizerId: string, input: ICreateAuction): Promise<IAuctionModel>;
  activateAuction(id: string, organizerId: string): Promise<IAuctionModel>;
  updateAuction(id: string, organizerId: string, input: IUpdateAuction, isAdmin: boolean): Promise<IAuctionModel>;
  updateAuctionLink(id: string, link: string): Promise<IAuctionModel>;
  getAuctionPriceLimits({ query, statusFilter, filters }: IAuctionFilters): Promise<{ min: number; max: number }>;
  countAuctions({ query, filters }: { query?: string; filters?: AuctionSearchFilters }): Promise<number>;
  getAuctions({ query, size, skip, orderBy, filters }: IAuctionFilters): Promise<IAuctionModel[]>;
  getAuctionsCount({ query, size, skip, orderBy, filters }: IAuctionFilters): Promise<number>;
  getAuction(id: string, organizerId?: string): Promise<IAuctionModel>;
  getAuctionSports(): Promise<string[]>;
  addAuctionAttachment(
    id: string,
    asset: IAuctionAssetModel,
    url: string,
    filename: string,
  ): Promise<IAuctionAssetModel>;
  getInfluencersAuctions(id: string): Promise<IAuctionModel[]>;
  getPopulatedAuction(auction: IAuctionModel): Promise<IAuctionModel>;
  getAuctionOrganizerUserAccountFromAuction(auction: IAuctionModel): Promise<IAuctionModel>;
  followAuction(auctionId: string, accountId: string): Promise<{ user: string; createdAt: Dayjs } | null>;
  unfollowAuction(auctionId: string, accountId: string): Promise<{ id: string }> | null;
}
