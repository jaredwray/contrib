import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import MultiCarousel from 'src/components/MultiCarousel';

import ReviewPreview from './ReviewPreview';
import styles from './styles.module.scss';

export default function Reviews() {
  const items = [...Array(5)].map((e: number, i: number) => <ReviewPreview key={i} review={null} />);
  return (
    <section className={styles.reviews}>
      <Container className={styles.homepageContainer}>
        <Row>
          <Col className="text-label label-with-separator">Testimonials</Col>
        </Row>
        <Row>
          <Col className="text-headline">What’s being said about Contrib.</Col>
        </Row>
        <MultiCarousel items={items} />
      </Container>
    </section>
  );
}
