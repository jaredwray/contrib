import { Dayjs } from 'dayjs';
import Dinero from 'dinero.js';

import { AuctionItem } from '../../dto/AuctionItem';

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
  items?: AuctionItem[];
  password?: string;
};
