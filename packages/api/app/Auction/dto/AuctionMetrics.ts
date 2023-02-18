export interface AuctionMetrics {
  clicks: object[];
  clicksByDay: object[];
  countries: object[];
  referrers: object[];
  browsers: object[];
  oss: object[];
}

export interface Click {
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
  clicks: Click[];
  referrers: Referrer[];
  countries: Country[];
}
