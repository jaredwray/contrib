import { Dayjs } from 'dayjs';

import { UserAccountAddress } from 'app/UserAccount/dto/UserAccountAddress';

import { AuctionParcel } from './AuctionParcel';
import { AuctionDeliveryStatus } from './AuctionDeliveryStatus';

export interface AuctionDelivery {
  deliveryMethod: string;
  shippingLabel: string;
  parcel: AuctionParcel;
  address: UserAccountAddress;
  status: AuctionDeliveryStatus;
  updatedAt: Dayjs;
  timeInTransit: Dayjs;
  identificationNumber: string;
}
