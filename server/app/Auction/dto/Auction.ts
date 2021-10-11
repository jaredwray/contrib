import Dinero from 'dinero.js';
import { Dayjs } from 'dayjs';
import { AuctionAssets } from './AuctionAssets';
import { Charity } from '../../Charity/dto/Charity';
import { ShortLink } from '../../ShortLink/dto/ShortLink';
import { AuctionStatus } from './AuctionStatus';
import { AuctionWinner } from './AuctionWinner';
import { AuctionDelivery } from './AuctionDelivery';
import { InfluencerProfile } from '../../Influencer/dto/InfluencerProfile';
import { Follow } from '../../FollowDto';

export interface Auction {
  id: string;
  title: string;
  attachments: AuctionAssets[];
  auctionOrganizer: InfluencerProfile;
  charity: Charity;
  startDate: Dayjs;
  endDate: Dayjs;
  stoppedAt: Dayjs;
  status: AuctionStatus;
  totalBids: number;
  description: string;
  currentPrice: Dinero.Dinero;
  startPrice: Dinero.Dinero;
  itemPrice?: Dinero.Dinero;
  bitlylink?: string;
  shortLink?: ShortLink;
  fairMarketValue: Dinero.Dinero;
  followers?: Follow[];
  winner?: AuctionWinner;
  delivery: AuctionDelivery;
  isActive: boolean;
  isDraft: boolean;
  isSettled: boolean;
  isFailed: boolean;
  isSold: boolean;
  isStopped: boolean;
}
