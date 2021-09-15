import { FC, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { format } from 'date-fns-tz';
import { useToasts } from 'react-toast-notifications';

import { ShippingRegistrationMutation } from 'src/apollo/queries/auctions';
import AsyncButton from 'src/components/AsyncButton';
import { ParcelProps } from 'src/helpers/ParcelProps';
import { USAStates } from 'src/modules/delivery/DeliveryAddressPage/USAStates';
import { Auction, AuctionDeliveryStatus } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  auction: Auction;
  refreshAuctionData: () => void;
}

export const Delivery: FC<Props> = ({ auction, refreshAuctionData }) => {
  const { addToast } = useToasts();

  const [registerShipping, { loading: shippingLoading }] = useMutation(ShippingRegistrationMutation);

  const handleRegisterShipping = useCallback(async () => {
    try {
      await registerShipping({
        variables: {
          auctionId: auction?.id,
          auctionWinnerId: auction?.winner?.mongodbId,
        },
      });
      refreshAuctionData();
      addToast('Charged', { autoDismiss: true, appearance: 'success' });
    } catch (error) {
      addToast(error.message, { autoDismiss: true, appearance: 'error' });
    }
  }, [addToast, registerShipping, refreshAuctionData, auction?.winner?.mongodbId, auction?.id]);

  const deliveryAddress = auction.delivery.address;
  const incomingState = USAStates.find((option) => option.value === deliveryAddress?.state)?.label;

  let updatedAt;
  if (auction.delivery?.updatedAt) {
    updatedAt = format(new Date(auction.delivery?.updatedAt), 'MMM dd yyyy HH:mm:ssXXX');
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
              <td>
                {auction.delivery?.status}
                {auction.delivery?.status === AuctionDeliveryStatus.DELIVERY_PAYMENT_FAILED && (
                  <AsyncButton
                    className="btn-sm w-100"
                    disabled={shippingLoading}
                    loading={shippingLoading}
                    variant="dark"
                    onClick={handleRegisterShipping}
                  >
                    Pay for delivery
                  </AsyncButton>
                )}
              </td>
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
            {auction.delivery?.shippingLabel && (
              <tr>
                <td>UPS delivery shippingLabel</td>
                <td>
                  <a className={styles.link} href={auction.delivery.shippingLabel} rel="noreferrer" target="_blank">
                    show
                  </a>
                </td>
              </tr>
            )}
          </>
        )}
      </tbody>
    </table>
  );
};

export default Delivery;
