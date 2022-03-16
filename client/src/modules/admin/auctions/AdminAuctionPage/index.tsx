import { useCallback, useState, useEffect } from 'react';

import { useMutation, useLazyQuery, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import {
  AuctionForAdminPageQuery,
  ChargeCurrentAuctionMutation,
  CustomerInformationQuery,
  AuctionMetricsQuery,
} from 'src/apollo/queries/auctions';
import { PopulatedAuctionBidsQuery, ChargeCurrentBidMutation } from 'src/apollo/queries/bids';
import AsyncButton from 'src/components/buttons/AsyncButton';
import ClicksAnalytics from 'src/components/customComponents/ClicksAnalytics';
import Loading from 'src/components/customComponents/Loading';
import Layout from 'src/components/layouts/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { AuctionBid } from 'src/types/Bid';

import AuctionItems from './AuctionItems';
import Bids from './Bids';
import Delivery from './Delivery';
import Details from './Details';
import { Modal } from './Modal';
import styles from './styles.module.scss';

export default function AdminAuctionPage() {
  const history = useHistory();
  const { auctionId } = useParams<{ auctionId: string }>();
  const { addToast } = useToasts();

  const [showDialog, setShowDialog] = useState(false);
  const [bid, setBid] = useState(null);
  const [isBid, setIsBid] = useState(false);

  const [chargeAuction, { loading: chargeLoading }] = useMutation(ChargeCurrentAuctionMutation);
  const [chargeBid, { loading: bidLoading }] = useMutation(ChargeCurrentBidMutation);

  const { data: auctionBids } = useQuery(PopulatedAuctionBidsQuery, { variables: { auctionId } });
  const { data: auctionMetricsData, loading: metricsLoading } = useQuery(AuctionMetricsQuery, {
    variables: { auctionId },
  });
  const [getAuctionData, { data: auctionData }] = useLazyQuery(AuctionForAdminPageQuery, {
    variables: { id: auctionId },
    fetchPolicy: 'cache-and-network',
  });
  const [getCustomerInformation, { data: customer, loading: customerLoading }] = useLazyQuery(CustomerInformationQuery);

  const metrics = auctionMetricsData?.getAuctionMetrics;
  const auction = auctionData?.auction;
  const charity = auction?.charity;
  const bids = auctionBids?.populatedBids || [];
  const customerInformation = customer?.getCustomerInformation;
  const showEditButton = !auction?.isSettled && !auction?.isSold && !auction?.isFailed;

  useEffect(() => getAuctionData(), [getAuctionData]);

  const handleChargeBid = useCallback(
    async (item) => {
      try {
        const { id, mongodbId, phoneNumber, status, stripeCustomerId, createdAt } = item.user;
        const user = { id, mongodbId, phoneNumber, status, stripeCustomerId, createdAt };
        await chargeBid({
          variables: {
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

  const handleEditClick = useCallback(() => {
    history.push(`/auctions/${auctionId}/price/fmv`);
  }, [auctionId, history]);

  if (!auction) return null;

  const hasBids = bids.length > 0;
  const maxBidAmount = Math.max(...bids.map(({ bid }: AuctionBid) => bid.amount));
  const maxBid = bids.filter(({ bid }: AuctionBid) => bid.amount === maxBidAmount)[0];

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
              <div className="text-headline mb-2">Auction details</div>
              <Details
                auction={auction}
                charity={charity}
                handleEditClick={handleEditClick}
                showEditButton={showEditButton}
              />
              {hasBids && auction.isFailed && (
                <AsyncButton
                  className={clsx(styles.select, 'p-2')}
                  disabled={customerLoading}
                  loading={customerLoading}
                  variant="dark"
                  onClick={onChargeClickHandler}
                >
                  Charge auction
                </AsyncButton>
              )}
              {auction.items.length > 0 && (
                <>
                  <div className="text-headline mb-2">Auction items</div>
                  <AuctionItems
                    handleEditClick={handleEditClick}
                    items={auction.items}
                    showEditButton={showEditButton}
                  />
                </>
              )}
              <div className="text-headline mb-2">Delivery</div>
              <Delivery auction={auction} refreshAuctionData={getAuctionData} />
            </Col>
            <Col lg="7">
              <>
                <div className="text-headline mb-2">Auction metrics </div>
                {metricsLoading ? <Loading /> : <ClicksAnalytics metrics={metrics} />}
              </>
            </Col>
          </Row>
          <Row className="pt-3">
            <Col>
              <div className="text-headline mb-2">Bids</div>
              <Bids
                bids={bids}
                loading={customerLoading}
                showProcessBtn={auction.isFailed}
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
