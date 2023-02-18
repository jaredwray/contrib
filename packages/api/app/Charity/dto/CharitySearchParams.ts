export interface CharitySearchParams {
  filters?: CharityFilters;
  orderBy?: string;
  skip?: number;
  size?: number;
}

export interface CharityFilters {
  status?: string;
  query?: string;
}
