import { Dayjs } from 'dayjs';

import { UserAccountAddress } from 'app/UserAccount/dto/UserAccountAddress';

import { AuctionParcel } from './AuctionParcel';
import { AuctionDeliveryStatus } from './AuctionDeliveryStatus';

import { IShortLinkModel } from '../../ShortLink/mongodb/ShortLinkModel';

export interface AuctionDelivery {
  shortLink?: IShortLinkModel['_id'];
  deliveryMethod: string;
  shippingLabel: string;
  parcel: AuctionParcel;
  address: UserAccountAddress;
  status: AuctionDeliveryStatus;
  updatedAt: Dayjs;
  timeInTransit: Dayjs;
  identificationNumber: string;
}
