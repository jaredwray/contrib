/* eslint-disable react/jsx-sort-props */
import { useContext, useEffect, useState, FC } from 'react';

import { useQuery, useLazyQuery } from '@apollo/client';
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { AuctionQuery, AuctionSubscription, AuctionMetricsQuery } from 'src/apollo/queries/auctions';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { CharityStatus } from 'src/types/Charity';

import About from './About';
import AttachmentsSlider from './AttachmentsSlider';
import AuctionDetails from './AuctionDetails';
import Author from './Author';
import Benefits from './Benefits';
import DeliveryInfo from './DeliveryInfo';
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
    /* istanbul ignore next */
    onCompleted: ({ getAuctionMetrics }) => {
      setMetrics(getAuctionMetrics);
    },
  });

  useEffect(() => {
    subscribeToMore({
      document: AuctionSubscription,
      /* istanbul ignore next */
      updateQuery: (prev, incoming) => {
        if (!incoming.subscriptionData.data) return prev;
        const { auction } = incoming.subscriptionData.data;
        return { auction: { ...prev.auction, ...auction } };
      },
    });
  }, [subscribeToMore]);

  const auction = auctionData?.auction;

  if (auction === null) {
    history.replace('/404');
    return null;
  }

  if (auction?.isDraft) {
    history.push(`/`);
    return null;
  }

  const isMyAuction = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(
    auction?.auctionOrganizer?.id,
  );

  if (!account?.isAdmin && !isMyAuction && isDeliveryPage && (!auction?.isSettled || !auction?.isStopped)) {
    history.goBack();
    return null;
  }

  if (!account?.isAdmin && !isMyAuction && (auction?.isDraft || auction?.isStopped)) {
    history.push(`/`);
    return null;
  }

  if (error || auction === undefined) return null;

  const isActiveCharity = auction?.charity?.status === CharityStatus.ACTIVE;
  const accountEntityId = account?.charity?.id || account?.influencerProfile?.id || account?.assistant?.influencerId;
  const withMetrcis =
    accountEntityId === auction?.auctionOrganizer?.id || accountEntityId === auction?.charity?.id || account?.isAdmin;

  const attachments = [...auction?.attachments].sort((a, b) => (a.type > b.type ? -1 : 1));

  setPageTitle(`${auction.title} auction`);

  return (
    <Layout>
      <Container className="pt-0 pt-md-5 pb-4 pb-md-5">
        <Row>
          <Col md="1" />
          <Col md="6">
            <AttachmentsSlider attachments={attachments} />
          </Col>
          <Col md="1" />
          <Col md="4">
            <AuctionDetails auction={auction} isDeliveryPage={isDeliveryPage} />
          </Col>
          <Col md="1" />
        </Row>
        <Row>
          <Col md="1" />
          <Col md="6">
            <Author {...auction.auctionOrganizer} />
            <About {...auction} />
            {(auction?.charity && account?.isAdmin) || isActiveCharity ? (
              <Benefits {...auction.charity} />
            ) : (
              <p className="pb-2 d-md-none" />
            )}
          </Col>
          <Col md="7" />
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
