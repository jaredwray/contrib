import Dinero from 'dinero.js';
import { Dayjs } from 'dayjs';
import { AuctionAssets } from './AuctionAssets';
import { Charity } from '../../Charity/dto/Charity';
import { AuctionStatus } from './AuctionStatus';
import { AuctionWinner } from './AuctionWinner';
import { AuctionDelivery } from './AuctionDelivery';
import { InfluencerProfile } from '../../Influencer/dto/InfluencerProfile';
import { Follow } from '../../FollowDto';

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
  stoppedAt: Dayjs;
  status: AuctionStatus;
  totalBids: number;
  description: string;
  fullPageDescription: string;
  currentPrice: Dinero.Dinero;
  startPrice: Dinero.Dinero;
  itemPrice?: Dinero.Dinero;
  link: string;
  fairMarketValue: Dinero.Dinero;
  followers?: Follow[];
  winner?: AuctionWinner;
  delivery: AuctionDelivery;
  timeZone: string;
  isActive: boolean;
  isDraft: boolean;
  isPending: boolean;
  isSettled: boolean;
  isFailed: boolean;
  isSold: boolean;
  isStopped: boolean;
}
