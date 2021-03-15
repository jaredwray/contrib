export enum AuctionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SETTLED = 'SETTLED',
}

export interface AuctionAttachment {
  id: string;
  uid: string;
  url: string;
  type: string;
  cloudflareUrl: string;
  thumbnail: string;
  originalFileName: string;
}

export interface AuctionBid {
  id: string;
  bid: number;
  createdAt: Date;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  fullPageDescription: string;
  playedIn: string;
  status: AuctionStatus;
  attachments: [AuctionAttachment];
  bids: [AuctionBid];
  startPrice: number;
  gameWorn: boolean;
  autographed: boolean;
  authenticityCertificate: boolean;
  sport: string;
  maxBid: AuctionBid;
  startDate: Date;
  initialPrice: number;
  endDate: Date;
  auctionOrganizer: string;
}
