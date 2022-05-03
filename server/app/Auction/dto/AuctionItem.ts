import Dinero from 'dinero.js';

export interface AuctionItem {
  contributor: string;
  name: string;
  fairMarketValue: Dinero.Dinero;
}
