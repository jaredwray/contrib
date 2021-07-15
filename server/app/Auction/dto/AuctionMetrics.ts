export interface AuctionMetrics {
  clicks: object[];
  clicksByDay: object[];
  countries: object[];
  referrers: object[];
}

export interface BitlyClick {
  clicks: string | number;
  date: string;
}
