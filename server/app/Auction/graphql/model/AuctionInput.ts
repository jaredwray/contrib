import { Dayjs } from 'dayjs';
import Dinero from 'dinero.js';

export type AuctionInput = {
  id?: string;
  title?: string;
  sport?: string;
  gameWorn?: boolean;
  autographed?: boolean;
  description?: string;
  fullPageDescription?: string;
  charity?: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
  startPrice?: Dinero.Dinero;
  itemPrice?: Dinero.Dinero;
  playedIn?: string;
  organizerId?: string;
  fairMarketValue?: Dinero.Dinero;
  timeZone?: string;
};
