import { FC, ReactElement, useCallback, useContext, useState } from 'react';

import clsx from 'clsx';
import { toDate } from 'date-fns-tz';
import Dinero from 'dinero.js';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import AuctionItemsFMV from 'src/components/customComponents/AuctionItems';
import InformationLink from 'src/components/customComponents/InformationLink';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { MAX_PRICE_VALUE } from 'src/constants';
import { Auction, AuctionDeliveryStatus } from 'src/types/Auction';

import BidButtons from './BidButtons';
import BidsListModal from './BidsListModal';
import Status from './Status';
import styles from './styles.module.scss';

interface Props {
  auction: Auction;
  isDeliveryPage?: boolean;
}

const AuctionDetails: FC<Props> = ({ auction, isDeliveryPage }): ReactElement => {
  const { account } = useContext(UserAccountContext);
  const [showBidsDialog, setShowBidsDialog] = useState(false);
  const auctionId = auction.id;

  const { currentPrice, endDate, title, isSold, isSettled, isActive, totalBids, items } = auction;

  const ended = toDate(endDate) <= new Date();
  const canBid = isActive && !ended && currentPrice.amount !== MAX_PRICE_VALUE * 100 && !isDeliveryPage;
  const isMyAuction = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(
    auction.auctionOrganizer.id,
  );
  const fairMarketValue = Dinero(auction.fairMarketValue);
  const hasFairMarketValue = fairMarketValue && fairMarketValue.getAmount() > 0;

  const withDeliveryInfoLink = (isMyAuction || account?.isAdmin) && (isSold || isSettled);
  const isWinner = auction.winner?.mongodbId === account?.mongodbId;
  const withLinkToDelivery =
    (isSold || isSettled) && isWinner && (process.env.REACT_APP_UPS_SHOW_LINK_ON_THE_AUCTION_PAGE ?? 'true') === 'true';

  const isPaid =
    auction.delivery.status === AuctionDeliveryStatus.DELIVERY_PAID ||
    auction.delivery.status === AuctionDeliveryStatus.DELIVERY_PAYMENT_FAILED;

  const viewAllBidsClick = useCallback(() => setShowBidsDialog(totalBids > 0), [totalBids, setShowBidsDialog]);

  return (
    <>
      <div className={clsx(styles.title, 'text-subhead pt-md-0 pt-4 pb-2 break-word')}>{title}</div>
      <hr className="mt-2" />
      <Status auction={auction} canBid={canBid} ended={ended} />
      <hr />

      <Row className="pt-3">
        <Col className="ps-0">
          <div className="text-label-new">Current Bid:</div>
          <div className="link" onClick={viewAllBidsClick}>
            View all bids ({totalBids})
          </div>
          <BidsListModal
            auctionId={auctionId}
            open={showBidsDialog}
            totalBids={totalBids}
            onClose={() => setShowBidsDialog(false)}
          />
        </Col>
        <Col className="text-label-new">{Dinero(currentPrice).toFormat('$0,0')}</Col>
      </Row>

      {hasFairMarketValue && (
        <Row className="pt-4">
          <Col className="ps-0">
            <div className={clsx(styles.fmv, 'text-label-new')}>Fair market value:</div>
            <InformationLink
              content="This value is carefully selected by the auction owner."
              text="How is this calculated?"
            />
          </Col>
          <Col className={clsx(styles.fmv, 'text-label-new')}>{fairMarketValue.toFormat('$0,0')}</Col>
        </Row>
      )}

      {items.length > 0 && <AuctionItemsFMV items={items} />}

      {canBid && <BidButtons auction={auction} ended={ended} />}

      {withLinkToDelivery && (
        <Link className="d-block mt-4" to={`/auctions/${auctionId}/delivery/${isPaid ? 'status' : 'address'}`}>
          {isPaid ? 'Delivery status' : 'Pay for delivery'}
        </Link>
      )}
      {!isDeliveryPage && withDeliveryInfoLink && (
        <Link className="d-block mt-4" to={`/auctions/${auctionId}/delivery/info`}>
          Delivery info page
        </Link>
      )}
    </>
  );
};

export default AuctionDetails;
