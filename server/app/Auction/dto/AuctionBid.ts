import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { Dinero } from 'dinero.js';
import dayjs from 'dayjs';

export interface AuctionBid {
  user: {
    id: UserAccount['id'];
  };
  bid: Dinero.Dinero;
  createdAt: dayjs.Dayjs;
}
