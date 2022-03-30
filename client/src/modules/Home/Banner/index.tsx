import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

export default function Banner() {
  return (
    <Container fluid className={clsx(styles.wrapper, 'position-relative p-0')}>
      <Row className="justify-content-md-center h-100">
        <Col className={clsx(styles.text, 'text-center my-auto')} lg="6" md="8" xl="5">
          CONTRIB is a fundraising platform that empowers influencers to engage with their fans and raise money for
          charities.
          <Link className={clsx(styles.link, 'text-label-new  d-block pt-1')} to="/">
            Learn More &#8250;
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
