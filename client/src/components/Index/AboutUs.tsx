import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

import './AboutUs.scss'

export default function AboutUs() {
  return (
    <section className="about-us">
      <Container className="homepage-container">
        <Row>
          <Col className="title pt-4">Who we are</Col>
        </Row>
        <Row>
          <Col xs="1" className="mt-3 mb-3 ml-3 separator"/>
        </Row>
        <Row>
          <Col className="description">
            Contrib is a digital fundraising platform that empowers athletes to engage with their fans, raise money for important charities, and make direct and meaningful impact in their communities.
          </Col>
        </Row>
        <Row>
          <Col className="pt-3 pb-4"><Button>How does it work? &gt;&gt;</Button></Col>
        </Row>
      </Container>
    </section>
  )
}
