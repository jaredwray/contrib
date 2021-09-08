import { useContext, useState, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import { Button, Row, InputGroup, Form as BForm } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useHistory, useParams, Link } from 'react-router-dom';

import { AuctionQuery } from 'src/apollo/queries/auctions';
import { DeliveryTextBlock } from 'src/components/DeliveryTextBlock';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { UserDialogLayout } from 'src/components/UserDialogLayout';
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

  const [executeAuctionData, { loading: updating, data: auctionData }] = useLazyQuery(AuctionQuery, {
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

  if (auction.delivery.status !== AuctionDeliveryStatus.PAID) {
    history.push(`/auctions/${auctionId}/delivery/payment`);
    return null;
  }

  const { name, state, city, street, zipCode, phoneNumber } = auction.delivery.address;
  const incomingState = USAStates.find((option) => option.value === state)?.label;

  const { title } = auction;

  const successBlock = (
    <DeliveryTextBlock
      arrivalDate={auction.delivery.timeInTransit}
      auctionTitle={auction.title}
      city={city}
      incomingState={incomingState}
      isStatusPage={true}
      loading={updating}
      name={name}
      phoneNumber={phoneNumber}
      state={state}
      street={street}
      zipCode={zipCode}
    >
      <div className="text-center pt-3 pb-3">
        You can track your parcel on
        <a
          className={clsx(styles.actionLink, 'pr-1 pl-1')}
          href={`https://www.ups.com/track?trackingNumber=${auction.delivery.identificationNumber}`}
          rel="noreferrer"
          target="_blank"
        >
          UPS website
        </a>
        using follow tracking ID:
      </div>

      <Row className="justify-content-center">
        <BForm.Group>
          <InputGroup>
            <BForm.Control disabled type="text" value={auction.delivery.identificationNumber} />
            <InputGroup.Append>
              <CopyToClipboard text={auction.delivery.identificationNumber} onCopy={() => setLinkCopied(true)}>
                <Button className={styles.copyBtn} type="button">
                  {(linkCopied && 'Copied') || 'Copy'}
                </Button>
              </CopyToClipboard>
            </InputGroup.Append>
          </InputGroup>
        </BForm.Group>
      </Row>
      <div className="text-center pt-2 pb-3">
        <Link className={styles.actionLink} to={`/auctions/${auctionId}`}>
          back to the auction
        </Link>
      </div>
    </DeliveryTextBlock>
  );

  setPageTitle(`Delivery status page for ${title} auction`);

  return (
    <UserDialogLayout
      backGroundStyle={styles.statusPageBackground}
      successBlock={successBlock}
      textColorStyle={styles.statusPageTextColor}
      title="Delivery status"
    ></UserDialogLayout>
  );
}
