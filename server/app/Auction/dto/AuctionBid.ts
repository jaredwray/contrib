import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { Dinero } from 'dinero.js';
import dayjs from 'dayjs';

export interface AuctionBid {
  bid: Dinero.Dinero;
  paymentSource: string;
  createdAt: dayjs.Dayjs;
  user: {
    id: UserAccount['id'];
  };
}
