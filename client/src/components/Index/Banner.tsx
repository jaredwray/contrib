import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

import './Banner.scss'

export default function Banner() {
  return (
    <section className="banner">
      <Container fluid="sm" className="wrapper homepage-container position-relative h-100">
        <Row>
          <Col xs="6" lg="9" className="pt-5 pb-3 pb-md-5 text-super">
            Make An Impact
          </Col>
        </Row>
        <Row>
          <Col><div className="banner-separator" /></Col>
        </Row>
        <Row>
          <Col xs="12" lg="8" className="pt-3 pb-3 text-headline">
            Auction your memorabelia quickly and hassle free
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <Link to="/" className="btn btn-primary btn-with-arrows">Sign Up</Link>
          </Col>
        </Row>
        <Row>
          <Col xs="9" sm="6" className="text-label text-all-cups position-absolute banner-signature">
            Stephan Frei<br/>Total raised: $248,000
          </Col>
        </Row>
      </Container>
    </section>
  )
}
