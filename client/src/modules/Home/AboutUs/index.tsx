import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import styles from './styles.module.scss';

export default function AboutUs() {
  return (
    <section className={styles.aboutUs}>
      <Container fluid="xxl">
        <Row>
          <Col className="text-label label-with-separator">Who we are</Col>
        </Row>
        <Row>
          <Col className="text-headline">
            Contrib is a digital fundraising platform that empowers influencers to engage with their fans, raise money
            for important charities, and make a direct and meaningful impact in their communities.
          </Col>
        </Row>
      </Container>
    </section>
  );
}
