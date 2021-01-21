import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'

import './Reviews.scss'

export default function Reviews() {
  return (
    <section className="reviews">
      <Container>
        <Row>
          <Col xl="12">
            <div className="title">Testimonials</div>
            <div className="separator"/>
            <h2>What’s being said about Contrib.</h2>

            <div className="quotes">
              <div className="review">
                <div className="avatar">
                  <Image className="reviewer" src="/content/img/users/reviewer-1.png" roundedCircle/>
                </div>
                <div className="quotes-sign" />
                <div className="quote">With Contrib’s direct approach I can get game-worn memorabelia into hands fans. No delay, no middleman, all for charity.</div>
                <div className="name text-sm text-sage font-bold text-uppercase mb-md-0">De’aaron Fox</div>
                <div className="badge">Verified Athlete</div>
              </div>

              <div className="review">
                <div className="avatar">
                  <Image className="reviewer" src="/content/img/users/reviewer-2.png" roundedCircle/>
                </div>
                <div className="quotes-sign" />
                <div className="quote">With Contrib’s direct approach I can get game-worn memorabelia into hands fans. No delay, no middleman, all for charity.</div>
                <div className="name text-sm text-sage font-bold text-uppercase mb-md-0">Diego Rossi</div>
                <div className="badge">Verified Athlete</div>
              </div>
             </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
