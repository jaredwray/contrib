import { FC } from 'react';

import { format } from 'date-fns';
import { Table } from 'react-bootstrap';

import { ParcelProps } from 'src/helpers/ParcelProps';
import { USAStates } from 'src/modules/auctions/delivery/DeliveryAddressPage/USAStates';
import { Auction } from 'src/types/Auction';

interface Props {
  auction: Auction;
}

export const Delivery: FC<Props> = ({ auction }) => {
  if (!auction.delivery) {
    return <>no delivery for this auction</>;
  }
  if (!auction.winner) {
    return <>no winner for this auction</>;
  }
  let deliveryAddress;
  if (auction.delivery.status) {
    const { name, state, city, street, zipCode } = auction.delivery.address!;
    const incomingState = USAStates.find((option) => option.value === state)?.label;
    deliveryAddress = {
      name,
      city,
      street,
      zipCode,
      incomingState,
    };
  }

  return (
    <Table className={'d-block d-sl-table'}>
      <thead>
        <tr>
          {auction.delivery.status && (
            <>
              <th>Recepient</th>
              <th>State</th>
              <th>City</th>
              <th>Street</th>
              <th>Postal Code</th>
              <th>Status</th>
            </>
          )}
          <th>Parcel properties</th>
          {auction.delivery.identificationNumber && <th>Identification Number</th>}
          {auction.delivery.timeInTransit && <th>Estimated arrival date</th>}
        </tr>
      </thead>
      <tbody className="font-weight-normal">
        <tr>
          {auction.delivery.status && (
            <>
              <td className="align-middle">{deliveryAddress?.name}</td>
              <td className="align-middle">{deliveryAddress?.incomingState}</td>
              <td className="align-middle">{deliveryAddress?.city}</td>
              <td className="align-middle">{deliveryAddress?.street}</td>
              <td className="align-middle">{deliveryAddress?.zipCode}</td>
              <td className="align-middle">{auction.delivery.status}</td>
            </>
          )}
          <td className="align-middle">{ParcelProps(auction)}</td>
          {auction.delivery.identificationNumber && (
            <td className="align-middle">{auction.delivery.identificationNumber}</td>
          )}
          {auction.delivery.timeInTransit && (
            <td className="align-middle">{format(new Date(auction.delivery.timeInTransit), 'MM/dd/yyyy')}</td>
          )}
        </tr>
      </tbody>
    </Table>
  );
};

export default Delivery;
