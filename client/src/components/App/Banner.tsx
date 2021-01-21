import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

import './Banner.scss'

export default function Banner() {
  return (
    <section className="banner">
      <Container>
        <Row>
          <Col xl="6">
            <h1 className="title">Make An Impact</h1>
            <div className="separator"/>
            <div className="description">
              <p>Auction your memorabelia quickly and hassle free.</p>
              <Button>Sign Up &gt;&gt;</Button>
            </div>
            <div className="signature">
              <div>Stephan Frei</div>
              <div>Total raised: $248,000</div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
