import { Dinero } from 'dinero.js';
import { UserAccount } from '../../../UserAccount/dto/UserAccount';

export type ChargeCurrentBidInput = {
  bid: Dinero;
  charityId: string;
  auctionTitle: string;
  user: UserAccount;
  charityStripeAccountId: string;
};
