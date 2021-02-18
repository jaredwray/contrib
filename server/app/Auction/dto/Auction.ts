import { Dayjs } from 'dayjs';
import { AuctionAssets } from './AuctionAssets';
import { Charity } from '../../Charity/dto/Charity';
import { AuctionStatus } from './AuctionStatus';

export interface Auction {
  title: string;
  sport: string;
  gameWorn: boolean;
  autographed: boolean;
  duration: string;
  assets: AuctionAssets;
  charity: Charity;
  startDate: Dayjs;
  status: AuctionStatus;
}
