import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';

import Status from '../Status';
import styles from './styles.module.scss';

export default function Banner() {
  return (
    <Container fluid className={clsx(styles.wrapper, 'position-relative p-0 mb-3')}>
      <Row className="justify-content-md-center h-100 p-4 font-bold">
        <Col lg="10" md="12" xxl="6">
          <div>
            <Status />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
