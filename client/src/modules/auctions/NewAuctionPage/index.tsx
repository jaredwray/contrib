import cn from 'clsx';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Layout from 'src/components/Layout';

import styles from './styles.module.scss';

const NewAuctionPage = () => {
  return (
    <Layout>
      <section className={styles.section}>
        <Container className={styles.root}>
          <p className="text-label label-with-separator">Auction an item</p>
          <p className="text-super mb-2">Get started</p>
          <p className="text-headline mb-4 mb-sm-5">Create your charity auction now. It’s just four easy steps:</p>
          <Row>
            <Col>
              <ol className={cn('mb-0 pl-3 text-subhead', styles.list)}>
                <li className={styles.listItem}>Enter item details</li>
                <li className={styles.listItem}>Add photos & video</li>
                <li className={styles.listItem}>Set price & charity</li>
                <li className={styles.listItem}>Go live & share</li>
              </ol>
            </Col>
            <Col className={styles.buttonWrapper}>
              <Link to="new/basic">
                <Button className={cn('btn-with-arrows w-100 h-100 text-subhead', styles.button)}>
                  Start your auction
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
        <Link to="new/basic">
          <Button className={cn(styles.mobileButton, 'btn-with-arrows w-100 text-subhead rounded-0')}>
            Start your auction
          </Button>
        </Link>
      </section>
    </Layout>
  );
};

export default NewAuctionPage;
