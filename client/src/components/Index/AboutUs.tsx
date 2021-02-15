import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

import './AboutUs.scss'

export default function AboutUs() {
  return (
    <section className="about-us">
      <Container className="homepage-container">
        <Row>
          <Col className="text-label label-with-separator">Who we are</Col>
        </Row>
        <Row>
          <Col className="text-headline">
            Contrib is a digital fundraising platform that empowers athletes to engage with their fans, raise money for important charities, and make direct and meaningful impact in their communities.
          </Col>
        </Row>
        <Row>
          <Col className="pt-3"><Button className="btn-with-arrows btn-ochre">How does it work?</Button></Col>
        </Row>
      </Container>
    </section>
  )
}
