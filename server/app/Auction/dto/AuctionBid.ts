import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { Dinero } from 'dinero.js';
import * as dayjs from 'dayjs';

export interface AuctionBid {
  id: string;
  user: {
    id: UserAccount['id'];
  };
  bid: Dinero.Dinero;
  createdAt: dayjs.Dayjs;
}
