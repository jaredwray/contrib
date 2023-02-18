import { Auction } from './Auction';

export interface AuctionsForProfilePage {
  live: Auction[] | [];
  won: Auction[] | [];
}
