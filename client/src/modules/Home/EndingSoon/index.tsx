import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Slider from 'src/components/Slider';

import AuctionPreview from './AuctionPreview';
import styles from './styles.module.scss';

export default function EndingSoon() {
  const items = [...Array(10)].map((e: number, i: number) => <AuctionPreview key={i} auction={null} />);

  return (
    <section className={styles.endingSoon}>
      <Container className={clsx(styles.homepageContainer, 'header')}>
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
        <Slider items={items} />
      </Container>
    </section>
  );
}
