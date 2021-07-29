import { DineroObject } from 'dinero.js';

import { Follow } from './Follow';
import { InfluencerProfile } from './InfluencerProfile';
import { Parcel } from './Parcel';

export enum AuctionStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SETTLED = 'SETTLED',
  FAILED = 'FAILED',
  SOLD = 'SOLD',
  STOPPED = 'STOPPED',
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

export interface Auction {
  id: string;
  title: string;
  description: string;
  fullPageDescription: string;
  playedIn: string;
  status: AuctionStatus;
  attachments: [AuctionAttachment];
  link: string;
  gameWorn: boolean;
  autographed: boolean;
  authenticityCertificate: boolean;
  sport: string;
  totalBids: number;
  startDate: string;
  endDate: string;
  stoppedAt?: string;
  startPrice: DineroObject;
  itemPrice?: DineroObject;
  currentPrice: DineroObject;
  auctionOrganizer: InfluencerProfile;
  fairMarketValue: DineroObject;
  followers?: Follow[];
  timeZone: string;
  isActive: boolean;
  isDraft: boolean;
  isPending: boolean;
  isSettled: boolean;
  isFailed: boolean;
  isSold: boolean;
  isStopped: boolean;
  parcel?: Parcel;
}
