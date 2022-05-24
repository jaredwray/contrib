import { UserAccountForBid } from '../../UserAccount/dto/UserAccountForBid';
import { Auction } from '../../Auction/dto/Auction';
import { Dayjs } from 'dayjs';

export interface Bid {
  user?: UserAccountForBid;
  auction?: Auction;
  bid: Dinero.Dinero;
  createdAt: Dayjs;
}
