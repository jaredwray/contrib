import { Dayjs } from 'dayjs';

export type IUpdateAuctionInput = {
  id: string;
  title?: string;
  sport?: string;
  gameWorn?: boolean;
  autographed?: boolean;
  charity: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
};
