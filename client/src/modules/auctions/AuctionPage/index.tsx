/* eslint-disable react/jsx-sort-props */
import { useContext, useEffect, useState, FC } from 'react';

import { useQuery, useLazyQuery } from '@apollo/client';
import { Col, Container, Row } from 'react-bootstrap';
import { CookiesProvider } from 'react-cookie';
import { useHistory, useParams } from 'react-router-dom';

import { AuctionQuery, AuctionSubscription, AuctionMetricsQuery } from 'src/apollo/queries/auctions';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { usePrivateAuction } from 'src/helpers/usePrivateAuction';

import AttachmentsSlider from './AttachmentsSlider';
import AuctionDetails from './AuctionDetails';
import DeliveryInfo from './DeliveryInfo';
import GeneralInformation from './GeneralInformation';
import Metrics from './Metrics';
import PrivateContent from './PrivateContent';
import SimilarAuctions from './SimilarAuctions';

interface Props {
  isDeliveryPage?: boolean;
}

const AuctionPage: FC<Props> = ({ isDeliveryPage }) => {
  const auctionId = useParams<{ auctionId: string }>().auctionId ?? 'me';
  const history = useHistory();
  const { account } = useContext(UserAccountContext);
  const [metrics, setMetrics] = useState(null);

  const { subscribeToMore, data: auctionData, error } = useQuery(AuctionQuery, {
    variables: { id: auctionId },
    fetchPolicy: 'cache-and-network',
  });
  const [requestMetrics] = useLazyQuery(AuctionMetricsQuery, {
    variables: { auctionId },
    onCompleted: ({ getAuctionMetrics }) => setMetrics(getAuctionMetrics),
  });

  const auction = auctionData?.auction;
  const accoutIsOwner = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(
    auction?.auctionOrganizer?.id,
  );
  const accoutIsOwnerOrAdmin = account?.isAdmin || accoutIsOwner;
  const { hasAccess } = usePrivateAuction(auction);

  useEffect(() => {
    subscribeToMore({
      document: AuctionSubscription,
      updateQuery: (prev, incoming) => /* istanbul ignore next */ {
        if (!incoming.subscriptionData.data) return prev;
        const { auction } = incoming.subscriptionData.data;
        return { auction: { ...prev.auction, ...auction } };
      },
    });
  }, [subscribeToMore]);

  if (error || auction === undefined) return null;
  if (auction === null) {
    history.replace('/404');
    return null;
  }
  if (
    auction.isDraft ||
    (auction.isStopped && !accoutIsOwnerOrAdmin) ||
    (isDeliveryPage && !accoutIsOwnerOrAdmin && auction && !(auction.isSettled || auction.isSold))
  ) {
    history.push('/');
    return null;
  }
  if (!hasAccess()) return <PrivateContent auction={auction} />;

  const accountEntityId = account?.charity?.id || account?.influencerProfile?.id || account?.assistant?.influencerId;
  const withMetrcis =
    accountEntityId === auction.auctionOrganizer?.id || accountEntityId === auction.charity?.id || account?.isAdmin;
  /* istanbul ignore next */
  const attachments = [...auction.attachments].sort((a, b) => (a.type > b.type ? -1 : 1));

  setPageTitle(`${auction.title} auction${isDeliveryPage ? '| Delivery information' : ''}`);

  return (
    <CookiesProvider>
      <Layout>
        <Container className="pt-0 pt-md-5 pb-4" fluid="xxl">
          <Row>
            <Col className="p-0" md="5">
              <AttachmentsSlider attachments={attachments} />
            </Col>
            <Col className="p-0" md="7">
              <Row>
                <Col className="px-0 ps-md-4" lg="7">
                  <AuctionDetails auction={auction} isDeliveryPage={isDeliveryPage} />
                </Col>
                <Col className="px-0 ps-md-4 pt-4 pt-lg-0" lg="5">
                  <GeneralInformation auction={auction} />
                </Col>
              </Row>
            </Col>
          </Row>
          {withMetrcis && !isDeliveryPage && (
            <Row>
              <Col md="1" />
              <Col>
                <Metrics metrics={metrics} requestMetrics={requestMetrics} />
              </Col>
            </Row>
          )}
          {isDeliveryPage && (
            <Row>
              <Col md="1" />
              <Col>
                <DeliveryInfo auction={auction} isDeliveryPage={isDeliveryPage} />
              </Col>
            </Row>
          )}
        </Container>
        <SimilarAuctions selectedAuction={auctionId} />
      </Layout>
    </CookiesProvider>
  );
};

export default AuctionPage;
