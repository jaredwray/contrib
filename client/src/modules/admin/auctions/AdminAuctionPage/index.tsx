import { useCallback, useState, useEffect } from 'react';

import { useMutation, useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import {
  AuctionForAdminPage,
  chargeCurrentAuction,
  chargeCurrendBid,
  CustomerInformation,
} from 'src/apollo/queries/auctions';
import AsyncButton from 'src/components/AsyncButton';
import Layout from 'src/components/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { utcTimeZones } from 'src/modules/auctions/editAuction/DetailsPage/consts';
import { AuctionBid } from 'src/types/Auction';

import Bids from './Bids';
import ClicksAnalytics from './ClicksAnalytics';
import Details from './Details';
import { Modal } from './Modal';
import styles from './styles.module.scss';

export default function AdminAuctionPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [bid, setBid] = useState(null);

  const [isBid, setIsBid] = useState(false);
  const { addToast } = useToasts();
  const [chargeAuction, { loading: chargeLoading }] = useMutation(chargeCurrentAuction);
  const [chargeBid, { loading: bidLoading }] = useMutation(chargeCurrendBid);

  const { auctionId } = useParams<{ auctionId: string }>();
  const [getAuctionData, { data: auctionData, error, loading }] = useLazyQuery(AuctionForAdminPage, {
    variables: { id: auctionId },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    getAuctionData();
  }, [getAuctionData]);

  const [getCustomerInformation, { data: customer, loading: customerLoading }] = useLazyQuery(CustomerInformation);

  const auction = auctionData?.getAuctionForAdminPage;
  const charity = auction?.charity;
  const bids = auction?.bids;
  const customerInformation = customer?.getCustomerInformation;

  const handleChargeBid = useCallback(
    async (item) => {
      try {
        const { id, mongodbId, phoneNumber, status, stripeCustomerId, createdAt } = item.user;
        const user = { id, mongodbId, phoneNumber, status, stripeCustomerId, createdAt };
        await chargeBid({
          variables: {
            paymentSource: item.paymentSource,
            charityId: charity?.id,
            charityStripeAccountId: charity?.stripeAccountId,
            bid: item.bid,
            auctionTitle: auction?.title,
            user,
          },
        });
        addToast('Charged', { autoDismiss: true, appearance: 'success' });
        setShowDialog(false);
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'error' });
      }
    },
    [addToast, chargeBid, auction?.title, charity?.id, charity?.stripeAccountId],
  );

  const handleChargeAuction = useCallback(async () => {
    try {
      await chargeAuction({ variables: { id: auctionId } });
      addToast('Charged', { autoDismiss: true, appearance: 'success' });
      setShowDialog(false);
      getAuctionData();
    } catch (error) {
      addToast(error.message, { autoDismiss: true, appearance: 'error' });
    }
  }, [auctionId, addToast, chargeAuction, getAuctionData]);

  if (error || loading || !auction) {
    return null;
  }
  const timeZone = utcTimeZones.find((timeZone) => timeZone.label === auction.timeZone)?.label || '';
  const hasBids = bids.length > 0;

  const maxBidAmount = Math.max(...bids.map(({ bid }: AuctionBid) => bid.amount));
  const maxBid = auction.bids.filter(({ bid }: AuctionBid) => bid.amount === maxBidAmount)[0];
  const onChargeClickHandler = () => {
    getCustomerInformation({ variables: { stripeCustomerId: maxBid.user.stripeCustomerId } });
    setShowDialog(true);
    setIsBid(false);
    setBid(maxBid);
  };
  const onBidClickHandler = (arg: any) => {
    getCustomerInformation({ variables: { stripeCustomerId: arg.user.stripeCustomerId } });
    setShowDialog(true);
    setIsBid(true);
    setBid(arg);
  };
  setPageTitle(`${auction.title} Auction info`);

  return (
    <Layout>
      <section className={clsx(styles.page, 'text-label p-sm-4 p-1 pt-4 pb-2')}>
        <Container fluid>
          <Row>
            <Col lg="5">
              <div className="text-headline">Auction details</div>
              <Details auction={auction} charity={charity} timeZone={timeZone} />
              {hasBids && auction.isFailed && (
                <AsyncButton
                  className={clsx(styles.select, 'p-2 mb-2 ')}
                  disabled={customerLoading}
                  loading={customerLoading}
                  variant="dark"
                  onClick={onChargeClickHandler}
                >
                  Charge auction
                </AsyncButton>
              )}
            </Col>
            <Col lg="7">
              <>
                <Row className="text-headline mb-2">Auction metrics </Row>
                <ClicksAnalytics auction={auction} bitly={auction.bitly} />
              </>
            </Col>
          </Row>
          <Row>
            <Col>
              <Bids
                bids={auction.bids}
                loading={customerLoading}
                showProcessBtn={auction.isActive || auction.isFailed}
                timeZone={timeZone}
                onBidClickHandler={onBidClickHandler}
              />
            </Col>
          </Row>
        </Container>
      </section>
      <Modal
        bid={bid}
        customerInformation={customerInformation}
        customerLoading={customerLoading}
        data-direction="right"
        isBid={isBid}
        loading={isBid ? bidLoading : chargeLoading}
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={isBid ? () => handleChargeBid(bid) : handleChargeAuction}
      />
    </Layout>
  );
}
