import { FC } from 'react';

import { Delivery } from 'src/modules/admin/auctions/AdminAuctionPage/Delivery';
import { Auction } from 'src/types/Auction';

import Row from '../common/Row';

interface Props {
  auction: Auction;
  isDeliveryPage?: boolean;
}

const DeliveryInfo: FC<Props> = ({ auction, isDeliveryPage }) => {
  return (
    <Row title="Delivery">
      <Delivery auction={auction} isDeliveryPage={isDeliveryPage} />
    </Row>
  );
};

export default DeliveryInfo;
