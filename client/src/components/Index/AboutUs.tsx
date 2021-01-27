import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

import './AboutUs.scss'

export default function AboutUs() {
  return (
    <section className="about-us">
      <Container className="homepage-container">
        <Row>
          <Col className="text-label">Who we are</Col>
        </Row>
        <Row>
          <Col className="mt-4 mb-3"><div className="about-us-separator" /></Col>
        </Row>
        <Row>
          <Col className="text-headline">
            Contrib is a digital fundraising platform that empowers athletes to engage with their fans, raise money for important charities, and make direct and meaningful impact in their communities.
          </Col>
        </Row>
        <Row>
          <Col className="pt-3"><Button className="btn-with-arrows">How does it work?</Button></Col>
        </Row>
      </Container>
    </section>
  )
}
