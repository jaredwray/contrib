export interface AuctionBid {
  user: {
    id: string;
    mongodbId: string;
    phoneNumber: string;
    stripeCustomerId: string;
    createdAt: Date;
  };
  bid: Dinero.Dinero;
  paymentSource: string;
  createdAt: Date;
}