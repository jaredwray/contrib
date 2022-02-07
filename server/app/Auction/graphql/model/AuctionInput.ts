import { Dayjs } from 'dayjs';
import Dinero from 'dinero.js';

export type AuctionInput = {
  id?: string;
  title?: string;
  description?: string;
  charity?: string;
  startDate?: Dayjs;
  duration?: number;
  endDate?: Dayjs;
  startPrice?: Dinero.Dinero;
  bidStep?: Dinero.Dinero;
  itemPrice?: Dinero.Dinero;
  organizerId?: string;
  fairMarketValue?: Dinero.Dinero;
};
