export interface AuctionMetrics {
  clicks: object[];
  clicksByDay: object[];
  countries: object[];
  referrers: object[];
}

export interface BitlyClick {
  clicks: number;
  date: string;
}
export interface Country {
  value: string;
  clicks: number;
}
export interface Referrer {
  value: string;
  clicks: number;
}
export interface Metrics {
  clicks: BitlyClick[];
  referrers: Referrer[];
  countries: Country[];
}
