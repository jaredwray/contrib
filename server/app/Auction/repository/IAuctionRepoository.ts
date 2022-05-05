import dayjs, { Dayjs } from 'dayjs';
import { Types } from 'mongoose';
import { IAuctionModel } from '../mongodb/AuctionModel';
import { AuctionSearchFilters } from '../dto/AuctionSearchFilters';
import { AuctionItem } from '../dto/AuctionItem';
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

export type IAuctionInput = {
  organizerId?: string;
  title?: string;
  description?: string;
  startPrice?: Dinero.Dinero;
  itemPrice?: Dinero.Dinero;
  fairMarketValue?: Dinero.Dinero;
  bidStep?: Dinero.Dinero;
  priceCurrency?: string;
  charity?: string;
  duration?: number;
  password?: string;
  startsAt?: Dayjs;
  endsAt?: Dayjs;
  items?: AuctionItem[];
};

export interface IAuctionRepository {
  createAuction(organizerId: string, input: IAuctionInput, isAdmin: boolean): Promise<IAuctionModel>;
  activateAuction(id: string, organizerId: string): Promise<IAuctionModel>;
  updateAuction(id: string, organizerId: string, input: IAuctionInput, isAdmin: boolean): Promise<IAuctionModel>;
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
