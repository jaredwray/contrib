import { FC, ReactElement, useContext } from 'react';

import clsx from 'clsx';
import { toDate } from 'date-fns-tz';
import Dinero from 'dinero.js';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import AuctionItemsFMV from 'src/components/customComponents/AuctionItems';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { Auction, AuctionDeliveryStatus } from 'src/types/Auction';

import BidButtons from './BidButtons';
import Status from './Status';
import styles from './styles.module.scss';

const FINAL_BID = 999999;

interface Props {
  auction: Auction;
  isDeliveryPage?: boolean;
}

const AuctionDetails: FC<Props> = ({ auction, isDeliveryPage }): ReactElement => {
  const { account } = useContext(UserAccountContext);
  const auctionId = auction.id;

  const { currentPrice, endDate, title, isSold, isSettled, isActive, totalBids, items } = auction;

  const ended = toDate(endDate) <= new Date();
  const canBid = isActive && !ended && currentPrice.amount !== FINAL_BID * 100 && !isDeliveryPage;
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

  return (
    <>
      <div className={clsx(styles.title, 'text-subhead pb-2 break-word')}>{title}</div>
      <hr />
      <Status auction={auction} canBid={canBid} ended={ended} />
      <hr />

      <Row className="pt-3">
        <Col>
          Current Bid:
          <div className="link">View all bids ({totalBids})</div>
        </Col>
        <Col>{Dinero(currentPrice).toFormat('$0,0')}</Col>
      </Row>

      {hasFairMarketValue && (
        <Row className="pt-4">
          <Col>
            Fair market value:
            <div className="link">How is this calculated?</div>
          </Col>
          <Col>{fairMarketValue.toFormat('$0,0')}</Col>
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
