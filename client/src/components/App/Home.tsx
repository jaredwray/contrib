import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

import '../../styles/Home.scss'

export default function Home() {
  return (
    <div className="home">
      <section className="banner">
        <Container>
          <Row>
            <Col xl="12">
              <h1 className="title">Make An Impact</h1>
              <div className="separator"/>
              <div className="description">
                <p>Auction your memorabelia quickly and hassle free.</p>
                <Button className="signUpButton">Sign Up &gt;&gt;</Button>
              </div>
              <div className="signature text-uppercase">
                <div className="name">Stephan Frei</div>
                <div className="description">Total raised: $248,000</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="aboutUs">
        <Container>
          <Row>
            <Col xl="12">
              <span className="title">Who we are</span>
              <div className="separator"/>
              <div className="description">
                <h2>Contrib is a digital fundraising platform that empowers athletes to engage with their fans, raise money for important charities, and make direct and meaningful impact in their communities.</h2>
                <Button>How does it work?</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}
