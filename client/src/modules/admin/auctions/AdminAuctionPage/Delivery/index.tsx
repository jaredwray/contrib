import { FC } from 'react';

import { format, utcToZonedTime } from 'date-fns-tz';

import { ParcelProps } from 'src/helpers/ParcelProps';
import { USAStates } from 'src/modules/auctions/delivery/DeliveryAddressPage/USAStates';
import { Auction } from 'src/types/Auction';

interface Props {
  auction: Auction;
  timeZone: string;
}

export const Delivery: FC<Props> = ({ auction, timeZone }) => {
  const deliveryAddress = auction.delivery.address;
  const incomingState = USAStates.find((option) => option.value === deliveryAddress?.state)?.label;
  let updatedAt;
  if (auction.delivery?.updatedAt) {
    updatedAt = format(utcToZonedTime(auction.delivery?.updatedAt, timeZone), 'MMM dd yyyy HH:mm:ssXXX');
  }

  return (
    <table className="d-inline table-bordered">
      <tbody className="font-weight-normal pb-3">
        <tr>
          <td>Parcel properties</td>
          <td>{ParcelProps(auction)}</td>
        </tr>
        {auction.delivery?.status && (
          <>
            <tr>
              <td>Recepient</td>
              <td>{deliveryAddress?.name}</td>
            </tr>
            <tr>
              <td>State</td>
              <td>{incomingState}</td>
            </tr>
            <tr>
              <td>City</td>
              <td>{deliveryAddress?.city}</td>
            </tr>
            <tr>
              <td>Street</td>
              <td>{deliveryAddress?.street}</td>
            </tr>
            <tr>
              <td>Postal Code</td>
              <td>{deliveryAddress?.zipCode}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{auction.delivery?.status}</td>
            </tr>
            <tr>
              <td>Updated at</td>
              <td>{updatedAt}</td>
            </tr>
            {auction.delivery.identificationNumber && (
              <tr>
                <td>Identification Number</td>
                <td>{auction.delivery.identificationNumber}</td>
              </tr>
            )}
            {auction.delivery.timeInTransit && (
              <tr>
                <td>Estimated arrival date</td>
                <td>{format(new Date(auction.delivery.timeInTransit), 'MM/dd/yyyy')}</td>
              </tr>
            )}
          </>
        )}
      </tbody>
    </table>
  );
};

export default Delivery;
