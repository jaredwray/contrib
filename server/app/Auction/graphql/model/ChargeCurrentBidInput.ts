import { Dinero } from 'dinero.js';
import { UserAccount } from '../../../UserAccount/dto/UserAccount';

export type ChargeCurrentBidInput = {
  bid: Dinero;
  paymentSource: string;
  charityId: string;
  auctionTitle: string;
  user: UserAccount;
  charityStripeAccountId: string;
};
