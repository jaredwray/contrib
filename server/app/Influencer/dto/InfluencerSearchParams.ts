export interface InfluencerSearchParams {
  filters?: InfluencerFilters;
  orderBy?: string;
  skip?: number;
  size?: number;
}

export interface InfluencerFilters {
  status?: string;
  query?: string;
}
