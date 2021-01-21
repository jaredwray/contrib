import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

import './AboutUs.scss'

export default function AboutUs() {
  return (
    <section className="about-us">
      <Container>
        <Row>
          <Col xl="12">
            <div className="title">Who we are</div>
            <div className="separator"/>
            <div className="description">
              <h2>Contrib is a digital fundraising platform that empowers athletes to engage with their fans, raise money for important charities, and make direct and meaningful impact in their communities.</h2>
              <Button>How does it work? &gt;&gt;</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
