export interface InvitationsParams {
  filters?: InvitationFilters;
  skip?: number;
  size?: number;
}

export interface InvitationFilters {
  query?: string;
}
