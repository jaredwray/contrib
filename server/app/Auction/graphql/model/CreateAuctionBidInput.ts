import { Dinero } from 'dinero.js';

export type ICreateAuctionBidInput = {
  id: string;
  user: { id: string };
  bid: Dinero;
};
