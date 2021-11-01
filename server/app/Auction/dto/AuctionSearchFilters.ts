import { Types } from 'mongoose';

export interface AuctionSearchFilters {
  minPrice?: number;
  maxPrice?: number;
  auctionOrganizer?: Types.ObjectId;
  status?: string[];
  charity?: string[];
  selectedAuction?: string;
  winner?: string;
  ids?: string[];
}
