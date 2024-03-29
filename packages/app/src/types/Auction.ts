import { DineroObject } from 'dinero.js';

import { Address } from './Address';
import { Charity } from './Charity';
import { Follow } from './Follow';
import { InfluencerProfile } from './InfluencerProfile';
import { Parcel } from './Parcel';
import { ShortLink } from './ShortLink';
import { Winner } from './Winner';

export enum AuctionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SETTLED = 'SETTLED',
  FAILED = 'FAILED',
  SOLD = 'SOLD',
  STOPPED = 'STOPPED',
  PENDING = 'PENDING',
}

export enum AuctionDeliveryStatus {
  ADDRESS_PROVIDED = 'ADDRESS_PROVIDED',
  PAID = 'PAID',
  DELIVERY_PAID = 'DELIVERY_PAID',
  DELIVERY_PAYMENT_FAILED = 'DELIVERY_PAYMENT_FAILED',
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

export interface AuctionDelivery {
  shippingLabel: string;
  deliveryMethod: string;
  parcel: Parcel;
  address?: Address;
  status: AuctionDeliveryStatus;
  updatedAt: Date;
  timeInTransit?: string;
  identificationNumber?: string;
}

export interface AuctionItem {
  id: string;
  name: string;
  contributor: string;
  fairMarketValue: { amount: number; currency: Dinero.Currency };
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  status: AuctionStatus;
  attachments: [AuctionAttachment];
  totalBids: number;
  startsAt: string;
  endsAt: string;
  stoppedAt?: string;
  startPrice: DineroObject;
  bidStep: DineroObject;
  itemPrice?: DineroObject;
  currentPrice: DineroObject;
  auctionOrganizer: InfluencerProfile;
  bitlyLink?: string;
  shortLink: ShortLink;
  fairMarketValue: DineroObject;
  items: AuctionItem[];
  followers?: Follow[];
  winner?: Winner;
  charity: Charity;
  delivery: AuctionDelivery;
  isActive: boolean;
  isDraft: boolean;
  isSettled: boolean;
  isFailed: boolean;
  isSold: boolean;
  isStopped: boolean;
  password?: string;
}
