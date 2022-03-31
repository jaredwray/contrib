import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';

import styles from './styles.module.scss';

export default function Banner() {
  return (
    <Container fluid className={clsx(styles.wrapper, 'position-relative p-0')}>
      <Row className="justify-content-md-center h-100">
        <Col className={clsx(styles.text, 'text-center my-auto p-3')} md="8" xxl="5">
          <div>
            <span className={styles.contribFontWeight}>CONTRIB</span> is a fundraising platform that empowers
            influencers to engage with their fans and raise money for charities.
          </div>
        </Col>
      </Row>
    </Container>
  );
}
