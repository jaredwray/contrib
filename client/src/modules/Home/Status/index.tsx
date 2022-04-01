import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';

import { Badges } from './Badges';
import styles from './styles.module.scss';

export default function Status() {
  return (
    <Container fluid className={styles.root}>
      <Container className="p-0" fluid="xxl">
        <Row className="pt-4">
          <Col className="text-center text-md-start px-0 pb-4 pb-md-0 py-lg-0" lg="6" md="6" sm="4">
            <div className={clsx(styles.title, 'pb-1 pb-md-0')}>Make An Impact.</div>
            <div className={clsx(styles.label, 'px-0 px-md-0 mx-md-0 col-8 col-md-12 m-auto text-subhead')}>
              Direct Influencer-To-Fan Charity Auctions
            </div>
          </Col>
          <Badges />
        </Row>
      </Container>
    </Container>
  );
}
