/* eslint-disable react/jsx-sort-props */
import { useQuery } from '@apollo/client';
import { Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useHistory, useParams } from 'react-router-dom';

import { AuctionQuery } from 'src/apollo/queries/auctions';
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

  const { loading: auctionLoading, data: auctionData, error } = useQuery(AuctionQuery, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;

  const link = encodeURIComponent(`https://16edae4dd724.ngrok.io/auctions/${auctionId}`);

  if (error?.message === 'Auction was not found' || auction?.status === AuctionStatus.DRAFT) {
    history.push(`/`);
  }

  if (auctionLoading || error) {
    return null;
  }
  return (
    <Layout>
      {auction && (
        <Helmet>
          <meta property="og:url" content={link} />
          {<meta property="og:image:height" content="400" />}
          {<meta property="og:image:width" content="400" />}
          <meta property="og:type" content="article" />
          {auction.title && <meta property="og:title" content={auction.title} />}
          {auction.description && <meta property="og:description" content={auction.description} />}
          {auction.attachments[0]?.url && <meta property="og:image:url" content={auction.attachments[0]?.url} />}
          {auction.attachments[0]?.url && <meta property="og:image:secure_url" content={auction.attachments[0]?.url} />}
          {/* <meta name="twitter:title" content={auction.title} />
          <meta name="twitter:description" content={auction.description} />
          <meta name="twitter:image" content={auction.attachments[0]?.url} />
          <meta name="twitter:url" content={link} /> */}
        </Helmet>
      )}
      <Container className="pt-0 pt-md-5 pb-0 pb-md-5">
        <Row>
          <Col md="1" />
          <Col md="6" xs="12">
            <AttachmentsSlider attachments={auction?.attachments} />
          </Col>
          <Col md="1" />
          <Col md="4" xs="12">
            <AuctionDetails auction={auction} />
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
