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
          <Col className="text-center px-0 pb-2 pb-sm-4 pb-lg-0 py-lg-0" xxl="12">
            <div className={clsx(styles.title, 'pb-1 pb-lg-0')}>Make An Impact.</div>
            <div className={clsx(styles.label, 'px-0 px-lg-0 mx-lg-0 text-subhead')}>
              Direct Influencer-To-Fan Charity Auctions
            </div>
          </Col>
        </Row>
        <Row className="pt-0 pt-lg-4">
          <Badges />
        </Row>
      </Container>
    </Container>
  );
}
