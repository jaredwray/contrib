import { useContext, useState, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Button, Row, InputGroup, Form as BForm, Col, Container } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useHistory, useParams, Link } from 'react-router-dom';

import { AuctionQuery } from 'src/apollo/queries/auctions';
import Layout from 'src/components/Layout';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { USAStates } from 'src/modules/delivery/DeliveryAddressPage/USAStates';
import { AuctionDeliveryStatus } from 'src/types/Auction';

import styles from './styles.module.scss';

export default function DeliveryStatusPage() {
  const [linkCopied, setLinkCopied] = useState(false);
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();

  const history = useHistory();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const [executeAuctionData, { loading, data: auctionData }] = useLazyQuery(AuctionQuery, {
    fetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    executeAuctionData({ variables: { id: auctionId } });
  }, [executeAuctionData, auctionId]);

  if (!auctionData) {
    return null;
  }

  if (!account) {
    RedirectWithReturnAfterLogin(`/auctions/${auctionId}/delivery/status`);
    return null;
  }

  const { auction } = auctionData;
  const isWinner = auction?.winner?.mongodbId === account?.mongodbId;

  if (!isWinner) {
    history.goBack();
    return null;
  }

  if (
    auction.delivery.status !== AuctionDeliveryStatus.DELIVERY_PAID &&
    auction.delivery.status !== AuctionDeliveryStatus.DELIVERY_PAYMENT_FAILED
  ) {
    history.push(`/auctions/${auctionId}/delivery/payment`);
    return null;
  }

  const { name, state, city, street, zipCode, phoneNumber } = auction.delivery.address;
  const incomingState = USAStates.find((option) => option.value === state)?.label;

  setPageTitle(`Delivery status page for ${auction.title} auction`);

  return (
    <Layout>
      <div className="d-flex flex-column justify-content-between flex-grow-1 pt-3 pt-md-5">
        <Container>
          <Row>
            <Col className="text-label label-with-separator">Delivery</Col>
          </Row>
          <Row>
            <Col className="text-headline">Delivery status</Col>
            <hr className={clsx(styles.hr, 'd-none d-md-block')} />
          </Row>
          <Row className="pt-3 pt-md-0">
            <Col md="6">
              <p>
                Status of
                <Link className={clsx(styles.actionLink, styles.markedText)} to={`/auctions/${auctionId}`}>
                  {auction?.title}
                </Link>
                auction
              </p>
              <p>
                Estimated delivery time is
                <span className={styles.markedText}>
                  {format(new Date(auction.delivery.timeInTransit!), 'MM/dd/yyyy')}
                </span>
              </p>
              {!auction.delivery.identificationNumber && (
                <p>We will message you with your shipping tracking information when it is shipped!</p>
              )}
              {auction.delivery.identificationNumber && (
                <>
                  <p>
                    You can track your parcel on
                    <a
                      className={clsx(styles.actionLink, styles.markedText)}
                      href={`https://www.ups.com/track?trackingNumber=${auction.delivery.identificationNumber}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      UPS website
                    </a>
                    using follow tracking ID:
                  </p>
                  <BForm.Group>
                    <InputGroup>
                      <BForm.Control
                        disabled
                        className={clsx(styles.copyInput, 'w-auto')}
                        type="text"
                        value={auction.delivery.identificationNumber}
                      />
                      <InputGroup.Append>
                        <CopyToClipboard
                          text={auction.delivery.identificationNumber}
                          onCopy={() => setLinkCopied(true)}
                        >
                          <Button className={styles.copyBtn} type="button">
                            {(linkCopied && 'Copied') || 'Copy'}
                          </Button>
                        </CopyToClipboard>
                      </InputGroup.Append>
                    </InputGroup>
                  </BForm.Group>
                </>
              )}
            </Col>
            {!loading && (
              <Col className="pt-4 pt-md-0 pb-3" md="6">
                Delivery address:
                <div className="text-subhead pt-3">
                  <div>
                    Recepient:<span className={styles.markedText}>{name}</span>
                  </div>
                  <div>
                    City:<span className={styles.markedText}>{city}</span>
                  </div>
                  <div>
                    Street:<span className={styles.markedText}>{street}</span>
                  </div>
                  <div>
                    State:<span className={styles.markedText}>{incomingState}</span>
                  </div>
                  <div>
                    Post code:
                    <span className={styles.markedText}>
                      {state}-{zipCode}
                    </span>
                  </div>
                  <div>
                    Phone number:
                    <span className={styles.markedText}>+{phoneNumber}</span>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </Layout>
  );
}
