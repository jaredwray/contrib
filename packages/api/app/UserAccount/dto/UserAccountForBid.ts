import { Dayjs } from 'dayjs';

export interface UserAccountForBid {
  id: string;
  mongodbId?: string;
  phoneNumber: string;
  stripeCustomerId: string;
  createdAt: Dayjs;
}
