import { Types } from 'mongoose';

export interface AuctionSearchFilters {
  sports?: string[];
  minPrice?: number;
  maxPrice?: number;
  auctionOrganizer?: Types.ObjectId;
  status?: string[];
  charity?: string[];
  selectedAuction?: string;
}
