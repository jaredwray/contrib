/* eslint-disable react/jsx-sort-props */
import { useContext } from 'react';

import { useQuery } from '@apollo/client';
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { AuctionQuery } from 'src/apollo/queries/auctions';
import Layout from 'src/components/Layout';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { AuctionStatus } from 'src/types/Auction';
import { CharityStatus } from 'src/types/Charity';

import About from './About';
import AttachmentsSlider from './AttachmentsSlider';
import AuctionDetails from './AuctionDetails';
import Author from './Author';
import Benefits from './Benefits';
import SimilarAuctions from './SimilarAuctions';

const AuctionPage = () => {
  const auctionId = useParams<{ auctionId: string }>().auctionId ?? 'me';
  const history = useHistory();
  const { account } = useContext(UserAccountContext);
  const { loading: auctionLoading, data: auctionData, error } = useQuery(AuctionQuery, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;
  const isActiveCharity = auction?.charity?.status === CharityStatus.ACTIVE;

  if (error?.message === 'Auction was not found' || auction?.status === AuctionStatus.DRAFT) {
    history.push(`/`);
  }

  if (auctionLoading || error) {
    return null;
  }
  const attachments = [...auction?.attachments].sort((a, b) => (a.type > b.type ? -1 : 1));
  return (
    <Layout>
      <Container className="pt-0 pt-md-5 pb-0 pb-md-5">
        <Row>
          <Col md="1" />
          <Col md="6">
            <AttachmentsSlider attachments={attachments} />
          </Col>
          <Col md="1" />
          <Col md="4">
            <AuctionDetails auction={auction} />
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
      </Container>
      <SimilarAuctions />
    </Layout>
  );
};

export default AuctionPage;
