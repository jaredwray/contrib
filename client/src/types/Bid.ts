import { DineroObject } from 'dinero.js';
import { UserAccount } from './UserAccount';

export interface AuctionBid {
  id: string;
  bid: DineroObject;
  createdAt: Date;
  charityId: string;
  user: UserAccount;
}
