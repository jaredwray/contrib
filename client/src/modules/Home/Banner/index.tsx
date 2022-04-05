import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';

import Status from '../Status';
import styles from './styles.module.scss';

export default function Banner() {
  return (
    <Container fluid className={clsx(styles.wrapper, 'position-relative p-0 pt-4')}>
      <Row className="justify-content-md-center">
        <Col className={clsx(styles.text, 'my-auto')} lg="6" md="9" xxl="6">
          <div className="p-4">
            <span className={styles.contribFontWeight}>CONTRIB</span> is a fundraising platform that empowers
            influencers to engage with their fans and raise money for charities.
          </div>
        </Col>
      </Row>
      <Row>
        <Status />
      </Row>
    </Container>
  );
}
