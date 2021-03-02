import { Dayjs } from 'dayjs';
import Dinero from 'dinero.js';

export type IUpdateAuctionInput = {
  id: string;
  title?: string;
  sport?: string;
  gameWorn?: boolean;
  autographed?: boolean;
  charity: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
  initialPrice?: Dinero.Dinero;
};
