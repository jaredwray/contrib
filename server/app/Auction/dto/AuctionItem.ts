import Dinero from 'dinero.js';

export interface AuctionItem {
  id: string;
  contributor: string;
  name: string;
  fairMarketValue: Dinero.Dinero;
}
