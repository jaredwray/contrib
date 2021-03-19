import { useQuery } from '@apollo/client';
import { Container, Row, Col } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { getAuction } from 'src/apollo/queries/auctions';
import Layout from 'src/components/Layout';
import { AuctionStatus } from 'src/types/Auction';

import About from './About';
import AttachmentsSlider from './AttachmentsSlider';
import AuctionDetails from './AuctionDetails';
import Author from './Author';
import Benefits from './Benefits';
import SimilarAuctions from './SimilarAuctions';

const AuctionPage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();

  const { loading: auctionLoading, data: auctionData, error } = useQuery(getAuction, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;

  if (error?.message === 'Auction was not found' || auction?.status === AuctionStatus.DRAFT) {
    history.push(`/`);
  }

  if (auctionLoading || error) {
    return null;
  }
  return (
    <Layout>
      <Container className="pt-0 pt-md-5 pb-0 pb-md-5">
        <Row>
          <Col md="1" />
          <Col md="6" xs="12">
            <AttachmentsSlider attachments={auction?.attachments} />
          </Col>
          <Col md="1" />
          <Col md="4" xs="12">
            <AuctionDetails {...auction} />
          </Col>
          <Col md="1" />
        </Row>

        <Row>
          <Col md="1" />
          <Col md="6" xs="12">
            <Author {...auction.auctionOrganizer} />
            <About {...auction} />
            <Benefits {...auction?.charity} />
          </Col>
          <Col md="7" />
        </Row>
      </Container>
      <SimilarAuctions />
    </Layout>
  );
};

export default AuctionPage;
