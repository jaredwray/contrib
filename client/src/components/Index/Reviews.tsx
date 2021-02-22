import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';

import './Reviews.scss';

const responsive = {
  size_1261_6000: {
    breakpoint: { max: 6000, min: 1261 },
    items: 2,
    partialVisibilityGutter: 20,
  },
  size_1151_1260: {
    breakpoint: { max: 1260, min: 1151 },
    items: 2,
    partialVisibilityGutter: -10,
  },
  size_1001_1150: {
    breakpoint: { max: 1150, min: 1001 },
    items: 1,
    partialVisibilityGutter: 400,
  },
  size_951_1000: {
    breakpoint: { max: 1000, min: 951 },
    items: 1,
    partialVisibilityGutter: 300,
  },
  size_851_950: {
    breakpoint: { max: 950, min: 851 },
    items: 1,
    partialVisibilityGutter: 200,
  },
  size_781_850: {
    breakpoint: { max: 850, min: 781 },
    items: 1,
    partialVisibilityGutter: 150,
  },
  size_577_780: {
    breakpoint: { max: 780, min: 577 },
    items: 1,
    partialVisibilityGutter: 90,
  },
  size_521_576: {
    breakpoint: { max: 576, min: 521 },
    items: 1,
    partialVisibilityGutter: 150,
  },
  size_411_520: {
    breakpoint: { max: 520, min: 411 },
    items: 1,
    partialVisibilityGutter: 100,
  },
  size_0_410: {
    breakpoint: { max: 410, min: 0 },
    items: 1,
    partialVisibilityGutter: 50,
  },
};

export default function Reviews() {
  return (
    <section className="reviews">
      <Container className="homepage-container">
        <Row>
          <Col className="text-label label-with-separator">Testimonials</Col>
        </Row>
        <Row>
          <Col className="text-headline">What’s being said about Contrib.</Col>
        </Row>

        <Carousel
          swipeable
          partialVisible
          infinite
          responsive={responsive}
          containerClass="carousel-container-with-scrollbar"
          className="quotes"
        >
          <div className="review">
            <div className="avatar">
              <Image className="reviewer" src="/content/img/users/reviewer-1.webp" roundedCircle />
            </div>
            <div className="quotes-sign" />
            <div className="text-subhead reviews-quote pt-2">
              With Contrib’s direct approach I can get game-worn memorabelia into hands fans. No delay, no middleman,
              all for charity.
            </div>
            <div className="text-subhead text-all-cups reviewers-name text-sm mb-md-0">De’aaron Fox</div>
            <div className="users-badge text-label pt-2">
              <span className="users-badge-verified" />
              Verified Athlete
            </div>
          </div>

          <div className="review">
            <div className="avatar">
              <Image className="reviewer" src="/content/img/users/reviewer-2.webp" roundedCircle />
            </div>
            <div className="quotes-sign" />
            <div className="text-subhead reviews-quote pt-2">
              With Contrib’s direct approach I can get game-worn memorabelia into hands fans. No delay, no middleman,
              all for charity.
            </div>
            <div className="text-subhead text-all-cups reviewers-name text-sm mb-md-0">Diego Rossi</div>
            <div className="users-badge text-label pt-2">
              <span className="users-badge-verified" />
              Verified Athlete
            </div>
          </div>

          <div className="review">
            <div className="avatar">
              <Image className="reviewer" src="/content/img/users/reviewer-1.webp" roundedCircle />
            </div>
            <div className="quotes-sign" />
            <div className="text-subhead reviews-quote pt-2">
              With Contrib’s direct approach I can get game-worn memorabelia into hands fans. No delay, no middleman,
              all for charity.
            </div>
            <div className="text-subhead text-all-cups reviewers-name text-sm mb-md-0">De’aaron Fox</div>
            <div className="users-badge text-label pt-2">
              <span className="users-badge-verified" />
              Verified Athlete
            </div>
          </div>

          <div className="review">
            <div className="avatar">
              <Image className="reviewer" src="/content/img/users/reviewer-2.webp" roundedCircle />
            </div>
            <div className="quotes-sign" />
            <div className="text-subhead reviews-quote pt-2">
              With Contrib’s direct approach I can get game-worn memorabelia into hands fans. No delay, no middleman,
              all for charity.
            </div>
            <div className="text-subhead text-all-cups reviewers-name text-sm mb-md-0">Diego Rossi</div>
            <div className="users-badge text-label pt-2">Verified Athlete</div>
          </div>
        </Carousel>
      </Container>
    </section>
  );
}
