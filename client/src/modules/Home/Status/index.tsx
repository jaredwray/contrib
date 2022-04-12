import React from 'react';

import clsx from 'clsx';
import { Container, Row } from 'react-bootstrap';

import { Badges } from './Badges';
import styles from './styles.module.scss';

export default function Status() {
  return (
    <Container fluid className={clsx(styles.root, 'p-0 pt-2')}>
      <Container className="p-0" fluid="xxl">
        <Row className="pt-0 mb-4 px-0">
          <Badges />
        </Row>
      </Container>
    </Container>
  );
}
