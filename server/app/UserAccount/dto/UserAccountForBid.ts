import { Dayjs } from 'dayjs';

export interface UserAccountForBid {
  id: string;
  phoneNumber: string;
  stripeCustomerId: string;
  createdAt: Dayjs;
}
