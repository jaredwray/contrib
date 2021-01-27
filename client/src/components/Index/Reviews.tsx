import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import Carousel from 'react-multi-carousel'

import 'react-multi-carousel/lib/styles.css'
import './Reviews.scss'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 2,
    partialVisibilityGutter: 100
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    partialVisibilityGutter: 30
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    partialVisibilityGutter: 30
  }
}

export default function Reviews() {
  return (
    <section className="reviews pb-3 pb-md-5">
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
      </Container>

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
          <div className="badge text-label">Verified Athlete</div>
        </div>

        <div className="review">
          <div className="avatar">
            <Image className="reviewer" src="/content/img/users/reviewer-2.png" roundedCircle/>
          </div>
          <div className="quotes-sign"/>
          <div className="text-subhead reviews-quote pt-2">With Contrib’s direct approach I can get game-worn memorabelia into hands fans. No delay, no middleman, all for charity.</div>
          <div className="text-subhead text-all-cups reviewers-name text-sm mb-md-0">Diego Rossi</div>
          <div className="badge text-label">Verified Athlete</div>
        </div>

        <div className="review">
          <div className="avatar">
            <Image className="reviewer" src="/content/img/users/reviewer-1.png" roundedCircle/>
          </div>
          <div className="quotes-sign"/>
          <div className="text-subhead reviews-quote pt-2">With Contrib’s direct approach I can get game-worn memorabelia into hands fans. No delay, no middleman, all for charity.</div>
          <div className="text-subhead text-all-cups reviewers-name text-sm mb-md-0">De’aaron Fox</div>
          <div className="badge text-label">Verified Athlete</div>
        </div>

        <div className="review">
          <div className="avatar">
            <Image className="reviewer" src="/content/img/users/reviewer-2.png" roundedCircle/>
          </div>
          <div className="quotes-sign"/>
          <div className="text-subhead reviews-quote pt-2">With Contrib’s direct approach I can get game-worn memorabelia into hands fans. No delay, no middleman, all for charity.</div>
          <div className="text-subhead text-all-cups reviewers-name text-sm mb-md-0">Diego Rossi</div>
          <div className="badge text-label">Verified Athlete</div>
        </div>
      </Carousel>
    </section>
  )
}
