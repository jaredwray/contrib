import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

import './Banner.scss'

export default function Banner() {
  return (
    <section className="banner">
      <Container fluid="sm" className="wrapper">
        <Row>
          <Col xs="4" sm="3" md="6" lg="7" className="pt-5 pb-3 pb-md-5">
            <h1 className="title m-0">Make An Impact</h1>
          </Col>
        </Row>
        <Row>
          <Col xs="1" className="ml-3 separator"/>
        </Row>
        <Row>
          <Col xs="12" md="7" className="pt-3 pb-3 description">
            Auction your memorabelia quickly and hassle free.
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <Button>Sign Up &gt;&gt;</Button>
          </Col>
        </Row>
        <Row>
          <Col xs="9" sm="6" className="signature">
            <div>Stephan Frei</div>
            <div>Total raised: $248,000</div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
