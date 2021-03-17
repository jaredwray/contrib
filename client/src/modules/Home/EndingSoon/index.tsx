import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import AuctionsCarousel from 'src/components/AuctionsCarousel';

import styles from './styles.module.scss';

export default function EndingSoon() {
  return (
    <section className={styles.endingSoon}>
      <Container className={clsx(styles.homepageContainer, 'header pb-4')}>
        <Row className="pb-5">
          <Col className="text-super" lg="9" xs="12">
            Ending soon
          </Col>
          <Col className="align-self-end pr-lg-0 ml-1 ml-lg-0" lg="3" xs="12">
            <Link className={clsx('float-lg-right text-label text-all-cups', styles.seeAllLink)} to="/auctions">
              See all auctions &gt;&gt;
            </Link>
          </Col>
        </Row>
        <AuctionsCarousel auctions={[]} />
      </Container>
    </section>
  );
}
