import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import Carousel from 'react-multi-carousel'

import 'react-multi-carousel/lib/styles.css'
import './EndingSoon.scss'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    partialVisibilityGutter: 100
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    partialVisibilityGutter: 30
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    partialVisibilityGutter: 30
  }
}

export default function EndingSoon() {
  return (
    <section className="ending-soon">
      <Container className="header pt-4 pb-4">
        <Row>
          <Col lg="6" className="title">Ending soon</Col>
          <Col lg="6" className="align-self-end">
            <a href="/" className="see-all text-uppercase float-lg-right">See all auctions &gt;&gt;</a>
          </Col>
        </Row>
      </Container>

      <Carousel
        swipeable
        partialVisible
        infinite
        itemClass=""
        responsive={responsive}
        containerClass="carousel-container-with-scrollbar"
        className="auctions"
      >
        <div className="auction">
          <div className="like" />
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
          <div className="like" />
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

        <div className="auction">
          <div className="like" />
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
          <div className="like" />
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
      </Carousel>
    </section>
  )
}
