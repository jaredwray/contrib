import { Dinero } from 'dinero.js';

export type ChargeCurrentBidInput = {
  bid: Dinero;
  paymentSource: string;
  charityId: string;
  auctionTitle: string;
  user: string;
};
