export interface CreateBidInput {
  user: string;
  auction: string;
  bid: number;
  bidCurrency: Dinero.Currency;
  chargeId: string | null;
}
