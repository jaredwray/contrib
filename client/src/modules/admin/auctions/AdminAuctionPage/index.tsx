import { useCallback, useState } from 'react';

import { useQuery, useMutation } from '@apollo/client';
import clsx from 'clsx';
import { format, utcToZonedTime } from 'date-fns-tz';
import Dinero from 'dinero.js';
import { Button, Table, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { AuctionQuery, chargeCurrentAuction, chargeCurrendBid } from 'src/apollo/queries/auctions';
import Layout from 'src/components/Layout';
import { AuctionBid } from 'src/types/Auction';

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
  const { data: auctionData, error, loading } = useQuery(AuctionQuery, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;
  const charity = auction?.charity;
  const bids = auction?.bids;

  const handleChargeBid = useCallback(
    async (item) => {
      try {
        await chargeBid({
          variables: {
            paymentSource: item.paymentSource,
            charityId: charity?.id,
            bid: item.bid,
            auctionTitle: auction?.title,
            user: item.user,
          },
        });
        addToast('Charged', { autoDismiss: true, appearance: 'success' });
        setShowDialog(false);
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'error' });
      }
    },
    [addToast, chargeBid, auction?.title, charity?.id],
  );

  const handleChargeAuction = useCallback(async () => {
    try {
      await chargeAuction({ variables: { id: auctionId } });
      addToast('Charged', { autoDismiss: true, appearance: 'success' });
      setShowDialog(false);
    } catch (error) {
      addToast(error.message, { autoDismiss: true, appearance: 'error' });
    }
  }, [auctionId, addToast, chargeAuction]);

  if (error || loading || !auction) {
    return null;
  }

  const { startDate, endDate, timeZone } = auction;
  const auctionStartDate = format(utcToZonedTime(startDate, timeZone), 'MMM dd yyyy HH:mm:ssXXX');
  const auctionEndDate = format(utcToZonedTime(endDate, timeZone), 'MMM dd yyyy HH:mm:ssXXX');
  const hasBids = bids.length > 0;

  const maxBidAmount = Math.max(...bids.map(({ bid }: AuctionBid) => bid.amount));
  const maxBid = auction.bids.filter(({ bid }: AuctionBid) => bid.amount === maxBidAmount)[0];
  const onChargeClickHandler = () => {
    setShowDialog(true);
    setIsBid(false);
    setBid(maxBid);
  };
  const onBidClickHandler = (arg: any) => {
    setShowDialog(true);
    setIsBid(true);
    setBid(arg);
  };

  return (
    <Layout>
      <section className={clsx(styles.page, 'text-label p-sm-4 p-1 pt-4 pb-2')}>
        <Container fluid>
          <Row>
            <Col className="text-headline">Auction details</Col>
          </Row>
          <Row>
            <Col>
              <Table className="d-inline table-bordered">
                <tbody className="font-weight-normal">
                  <tr>
                    <td>Id</td>
                    <td>{auctionId}</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>{auction.status}</td>
                  </tr>
                  <tr>
                    <td>Start Price</td>
                    <td>{Dinero(auction.startPrice).toFormat('$0,0')}</td>
                  </tr>
                  <tr>
                    <td>Current Price</td>
                    <td>{Dinero(auction.currentPrice).toFormat('$0,0')}</td>
                  </tr>
                  <tr>
                    <td>Fair Market Value</td>
                    <td>{auction.fairMarketValue && Dinero(auction.fairMarketValue).toFormat('$0,0')}</td>
                  </tr>
                  <tr>
                    <td>Start date</td>
                    <td>{auctionStartDate}</td>
                  </tr>
                  <tr>
                    <td>End date</td>
                    <td>{auctionEndDate}</td>
                  </tr>
                  <tr>
                    <td>Charity Name</td>
                    <td>{charity?.name}</td>
                  </tr>
                  <tr>
                    <td>Charity id</td>
                    <td>{charity?.id}</td>
                  </tr>
                  <tr>
                    <td>Influencer Name</td>
                    <td>{auction.auctionOrganizer.name}</td>
                  </tr>
                  <tr>
                    <td>Influencer id</td>
                    <td>{auction.auctionOrganizer.id}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col>
              {hasBids && auction.isFailed && (
                <Button className="p-2" variant="dark" onClick={onChargeClickHandler}>
                  Charge auction
                </Button>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              {!hasBids && 'no bids for this auction'}
              {hasBids && (
                <Table className="d-inline">
                  <thead>
                    <tr>
                      <th>Bid</th>
                      <th>Date</th>
                      <th>User Id</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="font-weight-normal">
                    {bids.map((bid: AuctionBid, i: number) => (
                      <tr key={i}>
                        <td className="align-middle">{bid.bid && `$${bid.bid?.amount / 100}`}</td>
                        <td className="align-middle">
                          {format(utcToZonedTime(bid.createdAt, timeZone), 'MMM dd yyyy HH:mm:ssXXX')}
                        </td>
                        <td className="align-middle">{bid.user}</td>
                        <td className="align-middle">
                          <Button
                            className={styles.bidButton}
                            variant="secondary"
                            onClick={() => onBidClickHandler(bid)}
                          >
                            Process the bid
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
        </Container>
      </section>
      <Modal
        bid={bid}
        isBid={isBid}
        loading={isBid ? bidLoading : chargeLoading}
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={isBid ? () => handleChargeBid(bid) : handleChargeAuction}
      />
    </Layout>
  );
}
