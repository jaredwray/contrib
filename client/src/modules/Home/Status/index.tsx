import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';

import { Badges } from './Badges';
import styles from './styles.module.scss';

export default function Status() {
  return (
    <Container fluid className={clsx(styles.root, 'p-0')}>
      <Container className="p-0" fluid="xxl">
        <Row className="pt-4">
          <Col className="text-center px-0 pb-3">
            <div className={clsx(styles.title, 'm-auto text-uppercase')}>Make an impact!</div>
          </Col>
        </Row>
        <Row className="pt-0 mb-4 px-4">
          <Badges />
        </Row>
        <Row className="p-0 px-4 px-xl-0 pt-4 pb-1">
          <span className={clsx(styles.subtitle, 'p-0 text-center text-md-start')}>
            Direct <span className={styles.italicSubtitle}>Influencer-To-Fan</span> Charity Auctions
          </span>
        </Row>
      </Container>
    </Container>
  );
}
