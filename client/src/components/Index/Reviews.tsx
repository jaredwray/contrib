import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import Carousel from 'react-multi-carousel'

import './Reviews.scss'

const responsive = {
  size_8: {
    breakpoint: { max: 3000, min: 1260 },
    items: 2,
    partialVisibilityGutter: 80
  },
  size_7: {
    breakpoint: { max: 1260, min: 1150 },
    items: 2,
    partialVisibilityGutter: 60
  },
  size_6: {
    breakpoint: { max: 1150, min: 1000 },
    items: 1,
    partialVisibilityGutter: 500
  },
  size_5: {
    breakpoint: { max: 1000, min: 950 },
    items: 1,
    partialVisibilityGutter: 400
  },
  size_4: {
    breakpoint: { max: 950, min: 850 },
    items: 1,
    partialVisibilityGutter: 300
  },
  size_3: {
    breakpoint: { max: 850, min: 780 },
    items: 1,
    partialVisibilityGutter: 250
  },
  size_2: {
    breakpoint: { max: 780, min: 576 },
    items: 1,
    partialVisibilityGutter: 90
  },
  size_1: {
    breakpoint: { max: 576, min: 0 },
    items: 1,
    partialVisibilityGutter: 80
  }
}

export default function Reviews() {
  return (
    <section className="reviews">
      <Container className="homepage-container">
        <Row>
          <Col className="text-label">Testimonials</Col>
        </Row>
        <Row>
          <Col className="mt-4 mb-3"><div className="reviews-separator" /></Col>
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
              <Image className="reviewer" src="/content/img/users/reviewer-1.png" roundedCircle/>
            </div>
            <div className="quotes-sign"/>
            <div className="text-subhead reviews-quote pt-2">With Contrib’s direct approach I can get game-worn memorabelia into hands fans. No delay, no middleman, all for charity.</div>
            <div className="text-subhead text-all-cups reviewers-name text-sm mb-md-0">De’aaron Fox</div>
            <div className="users-badge text-label pt-2"><span className="users-badge-verified"/>Verified Athlete</div>
          </div>

          <div className="review">
            <div className="avatar">
              <Image className="reviewer" src="/content/img/users/reviewer-2.png" roundedCircle/>
            </div>
            <div className="quotes-sign"/>
            <div className="text-subhead reviews-quote pt-2">With Contrib’s direct approach I can get game-worn memorabelia into hands fans. No delay, no middleman, all for charity.</div>
            <div className="text-subhead text-all-cups reviewers-name text-sm mb-md-0">Diego Rossi</div>
            <div className="users-badge text-label pt-2"><span className="users-badge-verified"/>Verified Athlete</div>
          </div>

          <div className="review">
            <div className="avatar">
              <Image className="reviewer" src="/content/img/users/reviewer-1.png" roundedCircle/>
            </div>
            <div className="quotes-sign"/>
            <div className="text-subhead reviews-quote pt-2">With Contrib’s direct approach I can get game-worn memorabelia into hands fans. No delay, no middleman, all for charity.</div>
            <div className="text-subhead text-all-cups reviewers-name text-sm mb-md-0">De’aaron Fox</div>
            <div className="users-badge text-label pt-2"><span className="users-badge-verified"/>Verified Athlete</div>
          </div>

          <div className="review">
            <div className="avatar">
              <Image className="reviewer" src="/content/img/users/reviewer-2.png" roundedCircle/>
            </div>
            <div className="quotes-sign"/>
            <div className="text-subhead reviews-quote pt-2">With Contrib’s direct approach I can get game-worn memorabelia into hands fans. No delay, no middleman, all for charity.</div>
            <div className="text-subhead text-all-cups reviewers-name text-sm mb-md-0">Diego Rossi</div>
            <div className="users-badge text-label pt-2">Verified Athlete</div>
          </div>
        </Carousel>
      </Container>
    </section>
  )
}
