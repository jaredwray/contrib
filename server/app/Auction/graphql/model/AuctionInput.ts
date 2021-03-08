import { Dayjs } from 'dayjs';
import Dinero from 'dinero.js';

export type AuctionInput = {
  id?: string;
  title?: string;
  sport?: string;
  gameWorn?: boolean;
  autographed?: boolean;
  fullPageDescription?: string;
  charity?: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
  initialPrice?: Dinero.Dinero;
  playedIn?: string;
};
