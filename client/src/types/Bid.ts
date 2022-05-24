import { DineroObject } from 'dinero.js';
import { UserAccount } from './UserAccount';
import { Auction } from './Auction';

export interface AuctionBid {
  id: string;
  bid: DineroObject;
  createdAt: string;
  charityId: string;
  user: UserAccount;
  auction?: Auction;
}
