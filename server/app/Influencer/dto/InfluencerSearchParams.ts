export interface InfluencerSearchParams {
  filters?: InfluencerFilters;
  orderBy?: string;
  skip?: number;
  size?: number;
}

export interface InfluencerFilters {
  assistantId?: string;
  status?: string;
  query?: string;
}
