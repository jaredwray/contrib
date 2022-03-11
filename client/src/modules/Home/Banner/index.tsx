import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';

import styles from './styles.module.scss';

export default function Banner() {
  return (
    <section className={styles.banner}>
      <Container className={clsx(styles.homepageContainer, 'position-relative h-100 m-0')} fluid="xxl">
        <div className={styles.wrapper}>
          <Row>
            <Col className="pt-5 pt-md-4 pt-lg-5 pb-3 pb-md-4 pb-lg-4 text-super" lg="8" xs="6">
              Make An Impact
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={styles.separator} />
            </Col>
          </Row>
          <Row>
            <Col className={clsx(styles.message, 'pt-3 pb-3 text-super-headline text-capitalize')} lg="6">
              Direct
              <br />
              influencer-to-fan
              <br />
              charity auctions
            </Col>
          </Row>
          <Row>
            <Col className={clsx(styles.signature, 'text-label text-all-cups position-absolute')} sm="6" xs="9">
              Stefan Frei
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
}
