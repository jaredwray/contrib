import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';

import Status from '../Status';
import styles from './styles.module.scss';

export default function Banner() {
  return (
    <Container fluid className={clsx(styles.wrapper, 'position-relative p-0')}>
      <Row className="justify-content-md-center h-100 p-4 font-bold">
        <Col lg="10" md="12" xxl="6">
          <div className={clsx(styles.text, 'text-center my-auto p-4')}>
            <span className={styles.contribFontWeight}>CONTRIB</span> is a fundraising platform that empowers
            influencers to engage with their fans and raise money for charities.
          </div>
          <div>
            <Status />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
