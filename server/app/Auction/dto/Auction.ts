import Dinero from 'dinero.js';
import { Dayjs } from 'dayjs';
import { AuctionAssets } from './AuctionAssets';
import { Charity } from '../../Charity/dto/Charity';
import { AuctionStatus } from './AuctionStatus';
import { InfluencerProfile } from '../../Influencer/dto/InfluencerProfile';

export interface Auction {
  id: string;
  title: string;
  sport: string;
  gameWorn: boolean;
  autographed: boolean;
  attachments: AuctionAssets[];
  auctionOrganizer: InfluencerProfile;
  charity: Charity;
  startDate: Dayjs;
  endDate: Dayjs;
  status: AuctionStatus;
  bids: any[];
  totalBids: number;
  description: string;
  fullPageDescription: string;
  currentPrice: Dinero.Dinero;
  startPrice: Dinero.Dinero;
  link: string;
  fairMarketValue: Dinero.Dinero;
}
