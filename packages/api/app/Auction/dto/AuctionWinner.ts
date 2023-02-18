export interface AuctionWinner {
 mongodbId: string;
 address: {
   name: string;
   state: string;
   city: string;
   zipCode: string;
   street: string;
 };
}
