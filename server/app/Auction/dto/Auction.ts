import Dinero from 'dinero.js';
import { Dayjs } from 'dayjs';
import { AuctionAssets } from './AuctionAssets';
import { Charity } from '../../Charity/dto/Charity';
import { AuctionStatus } from './AuctionStatus';

export interface Auction {
  id: string;
  title: string;
  sport: string;
  gameWorn: boolean;
  autographed: boolean;
  attachments: AuctionAssets[];
  charity: Charity;
  startDate: Dayjs;
  endDate: Dayjs;
  status: AuctionStatus;
  bids: any[];
  maxBid: any;
  description: string;
  fullpageDescription: string;
  initialPrice: Dinero.Dinero;
}
