import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'

import './EndingSoon.scss'

export default function EndingSoon() {
  return (
    <section className="ending-soon">
      <Container>
        <Row>
          <Col xl="12">
            <div className="header">
              <h1>Ending soon</h1>
              <a href="/">See all auctions &gt;&gt;</a>
            </div>
            <div className="auctions">
              <div className="auction">
                <Image className="picture" src="/content/img/auctions/auction-item-1.png" />
                <div className="info">
                  <div className="owner">
                    <Image className="picture" src="/content/img/users/auction-owner-1.png" roundedCircle />
                    <div className="name text-sm text-sage font-bold text-uppercase mb-md-0">De’aaron Fox</div>
                  </div>
                  <div className="description">De’Aaron Fox Signed Game Worn Jersey</div>
                  <div className="price">$260.00</div>
                  <div className="statistics">1 bid • 7d 21h</div>
                </div>
              </div>

              <div className="auction">
                <Image className="picture" src="/content/img/auctions/auction-item-2.png" />
                <div className="info">
                  <div className="owner">
                    <Image className="picture" src="/content/img/users/auction-owner-2.png" roundedCircle />
                    <div className="name text-sm text-sage font-bold text-uppercase mb-md-0">Diego Rossi</div>
                  </div>
                  <div className="description">Diego Rossi Fox Signed Game Worn Jersey</div>
                  <div className="price">$11 000.00</div>
                  <div className="statistics">10 bids • 3d 1h</div>
                </div>
              </div>
             </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
