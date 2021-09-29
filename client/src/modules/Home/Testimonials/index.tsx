import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import Slider from 'src/components/customComponents/Slider';

import styles from './styles.module.scss';
import Testimonial from './Testimonial';

export default function Testimonials() {
  const items = [...Array(5)].map((e: number, i: number) => <Testimonial key={i} data={null} />);
  return (
    <section className={styles.reviews}>
      <Container className={styles.homepageContainer}>
        <Row>
          <Col className="text-label label-with-separator">Testimonials</Col>
        </Row>
        <Row>
          <Col className="text-headline">What’s being said about Contrib.</Col>
        </Row>
        <Slider items={items} />
      </Container>
    </section>
  );
}
