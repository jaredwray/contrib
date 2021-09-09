import { Dayjs } from 'dayjs';

import { AuctionParcel } from './AuctionParcel';
import { AuctionDeliveryStatus } from './AuctionDeliveryStatus';
import { UserAccountAddress } from 'app/UserAccount/dto/UserAccountAddress';

export interface AuctionDelivery {
  shippingLabel: string;
  parcel: AuctionParcel;
  address: UserAccountAddress;
  status: AuctionDeliveryStatus;
  updatedAt: Dayjs;
  timeInTransit: Dayjs;
  identificationNumber: string;
}
