import * as Dinero from 'dinero.js';
import * as dayjs from 'dayjs';

export interface IAuctionBid {
  id: string;
  bid: Dinero.Dinero;
  createdAt: dayjs.Dayjs;
}
