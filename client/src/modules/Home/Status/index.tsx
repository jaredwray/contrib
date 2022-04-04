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
          <Col className="text-center px-0 pb-2">
            <div className={clsx(styles.title, 'm-auto pb-2 pb-md-0')}>
              Make an impact.
              <span className={clsx(styles.subtitle, 'd-inline-block')}>
                &nbsp; Direct Influencer-To-Fan Charity Auctions.
              </span>
            </div>
          </Col>
        </Row>
        <Row className="pt-0 justify-content-center">
          <Badges />
        </Row>
      </Container>
    </Container>
  );
}
