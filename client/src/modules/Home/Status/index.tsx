import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';

import { Badges } from './Badges';
import styles from './styles.module.scss';

export default function Status() {
  return (
    <Container fluid className={styles.root}>
      <Container className="p-2" fluid="xxl">
        <Row className="d-flex flex-row justify-content-center py-4">
          <Badges />
        </Row>
      </Container>
    </Container>
  );
}
