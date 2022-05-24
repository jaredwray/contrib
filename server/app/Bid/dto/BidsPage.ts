import { Bid } from './Bid';

export interface BidsPageParams {
  size?: number;
  skip?: number;
}

export interface BidsPage {
  size: number;
  skip: number;
  items: Bid[];
  totalItems: number;
}
