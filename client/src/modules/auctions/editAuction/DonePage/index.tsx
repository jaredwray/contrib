import { useQuery } from '@apollo/client';
import { Button, ButtonGroup, Col, ProgressBar, Row, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { getAuction } from 'src/apollo/queries/auctions';
import FacebookIcon from 'src/assets/images/Facebook';
import InstagramIcon from 'src/assets/images/Instagram';
import TwitterIcon from 'src/assets/images/Twitter';
import AuctionCard from 'src/components/AuctionCard';
import Layout from 'src/components/Layout';

import styles from './styles.module.scss';

const AuctionDonePage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();

  const { data, error } = useQuery(getAuction, {
    variables: { id: auctionId },
  });
  const auction = data?.auction;

  return (
    <Layout>
      <ProgressBar now={100} />
      <Container fluid>
        <Row className="flex-column flex-md-row">
          <Col className={styles.left}>
            <div className={styles.wrapper}>
              <p className="text-super">Done</p>
              <p className="text-headline">Auction created.</p>
              <p className="text--body">
                Thank you! Your listing is now viewable and will start at the specified time. Now, let everyone know
                about the auction.
              </p>
              <div className={styles.buttonsGroup}>
                <ButtonGroup className="mb-3 w-100">
                  <Button className={styles.buttonIcon}>
                    <FacebookIcon />
                  </Button>
                  <Button className="text-label" variant="secondary">
                    Share on Facebook
                  </Button>
                </ButtonGroup>
                <ButtonGroup className="mb-3 w-100">
                  <Button className={styles.buttonIcon}>
                    <TwitterIcon />
                  </Button>
                  <Button className="text-label" variant="secondary">
                    Share on Twitter
                  </Button>
                </ButtonGroup>
                <ButtonGroup className="w-100">
                  <Button className={styles.buttonIcon}>
                    <InstagramIcon />
                  </Button>
                  <Button className="text-label" variant="secondary">
                    Share on Instagram
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </Col>
          <Col className={styles.rightCol}>{auction && !error && <AuctionCard justCreated auction={auction} />}</Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default AuctionDonePage;
