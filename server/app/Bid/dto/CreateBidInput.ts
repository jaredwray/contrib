export interface CreateBidInput {
  user: string;
  auction: string;
  bid: number;
  bidCurrency: Dinero.Currency;
  paymentSource: string;
  chargeId: string | null;
}
