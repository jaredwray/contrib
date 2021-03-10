import clsx from 'clsx';
import { Button, ButtonGroup, Col, ProgressBar, Row, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import FacebookIcon from 'src/assets/images/Facebook';
import InstagramIcon from 'src/assets/images/Instagram';
import TwitterIcon from 'src/assets/images/Twitter';
import Layout from 'src/components/Layout';

import styles from './styles.module.scss';

const AuctionDonePage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();

  return (
    <Layout>
      <ProgressBar now={100} />
      <Row>
        <Col className={styles.left}>
          <div className={styles.wrapper}>
            <p className="text-super">Done</p>
            <p className="text-heading">Auction created.</p>
            <p className="text-body">
              Thank you! Your listing is now viewable and will start at the specified time. Now, let everyone know about
              the auction.
            </p>
            <div className={styles.buttonsGroup}>
              <ButtonGroup className="mb-3 w-100">
                <Button className={styles.buttonIcon}>
                  <TwitterIcon />
                </Button>
                <Button className="btn-ochre">Share on Twitter</Button>
              </ButtonGroup>
              <ButtonGroup className="mb-3 w-100">
                <Button className={styles.buttonIcon}>
                  <FacebookIcon />
                </Button>
                <Button className="btn-ochre">Share on Facebook</Button>
              </ButtonGroup>
              <ButtonGroup className="w-100">
                <Button className={styles.buttonIcon}>
                  <InstagramIcon />
                </Button>
                <Button className="btn-ochre">Sign Up With Google</Button>
              </ButtonGroup>
            </div>
          </div>
        </Col>
        <Col className={styles.rightCol}>
          <div className={styles.auction}>
            <Image className={styles.auctionPicture} src="/content/img/auctions/auction-item-2.webp" />
            <div className="p-3">
              <div className="owner">
                <Image
                  roundedCircle
                  className={styles.auctionOwnerPicture}
                  src="/content/img/users/auction-owner-2.webp"
                />
                <div className="text-sm mb-md-0 text-label text-all-cups pl-2 d-inline-block">Diego Rossi</div>
              </div>
              <div className={clsx(styles.auctionTitle, 'text-subhead pt-2')}>
                Diego Rossi Fox Signed Game Worn Jersey
              </div>
              <div className="price text-body-super">$11 000.00</div>
              <div className="text-label text-all-cups pt-2">10 bids • 3d 1h</div>
            </div>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default AuctionDonePage;
