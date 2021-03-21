import Dinero from 'dinero.js';
import dayjs from 'dayjs';

export interface IAuctionBid {
  id: string;
  bid: Dinero.Dinero;
  createdAt: dayjs.Dayjs;
}
