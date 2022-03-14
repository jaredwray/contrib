/* eslint-disable react/jsx-sort-props */
import { useContext, useEffect, useState, FC } from 'react';

import { useQuery, useLazyQuery } from '@apollo/client';
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { AuctionQuery, AuctionSubscription, AuctionMetricsQuery } from 'src/apollo/queries/auctions';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';

import AttachmentsSlider from './AttachmentsSlider';
import AuctionDetails from './AuctionDetails';
import DeliveryInfo from './DeliveryInfo';
import GeneralInformation from './GeneralInformation';
import Metrics from './Metrics';
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
    onCompleted: ({ getAuctionMetrics }) => /* istanbul ignore next */ {
      setMetrics(getAuctionMetrics);
    },
  });

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

  const auction = auctionData?.auction;
  const accoutIsOwner = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(
    auction?.auctionOrganizer?.id,
  );
  const accoutIsOwnerOrAdmin = account?.isAdmin || accoutIsOwner;

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

  const accountEntityId = account?.charity?.id || account?.influencerProfile?.id || account?.assistant?.influencerId;
  const withMetrcis =
    accountEntityId === auction.auctionOrganizer?.id || accountEntityId === auction.charity?.id || account?.isAdmin;
  /* istanbul ignore next */
  const attachments = [...auction.attachments].sort((a, b) => (a.type > b.type ? -1 : 1));

  setPageTitle(`${auction.title} auction${isDeliveryPage ? '| Delivery information' : ''}`);

  return (
    <Layout>
      <Container className="pt-0 pt-md-5 pb-4 pb-md-5">
        <Row>
          <Col className="p-0" md="5" xxl="5">
            <AttachmentsSlider attachments={attachments} />
          </Col>
          <Col md="7" xxl="7">
            <Row>
              <Col lg="7" xxl="7">
                <AuctionDetails auction={auction} isDeliveryPage={isDeliveryPage} />
              </Col>
              <Col className="pt-4 pt-lg-0" lg="5" xxl="5">
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
  );
};

export default AuctionPage;
