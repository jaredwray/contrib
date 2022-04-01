import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';

import { Badges } from './Badges';
import styles from './styles.module.scss';

export default function Status() {
  return (
    <Container fluid className={styles.root}>
      <Container fluid="xxl">
        <Row className="pt-4">
          <Col className="text-center text-lg-start order-last order-lg-first pt-2 py-lg-0" lg="6" md="12">
            <div className={styles.title}>Make An Impact.</div>
            <div className={clsx(styles.label, 'text-subhead')}>Direct Influencer-To-Fan Charity Auctions</div>
          </Col>
          <Badges />
        </Row>
      </Container>
    </Container>
  );
}
