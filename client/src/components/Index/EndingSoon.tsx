import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import Carousel from 'react-multi-carousel'

import './EndingSoon.scss'

const responsive = {
  size_11: {
    breakpoint: { max: 3000, min: 1260 },
    items: 3,
    partialVisibilityGutter: 80
  },
  size_10: {
    breakpoint: { max: 1260, min: 1065 },
    items: 3,
    partialVisibilityGutter: 20
  },
  size_9: {
    breakpoint: { max: 1065, min: 890 },
    items: 2,
    partialVisibilityGutter: 90
  },
  size_8: {
    breakpoint: { max: 890, min: 800 },
    items: 2,
    partialVisibilityGutter: 20
  },
  size_7: {
    breakpoint: { max: 800, min: 700 },
    items: 2,
    partialVisibilityGutter: 0
  },
  size_6: {
    breakpoint: { max: 700, min: 620 },
    items: 1,
    partialVisibilityGutter: 250
  },
  size_5: {
    breakpoint: { max: 620, min: 576 },
    items: 1,
    partialVisibilityGutter: 200
  },
  size_4: {
    breakpoint: { max: 576, min: 500 },
    items: 1,
    partialVisibilityGutter: 180
  },
  size_3: {
    breakpoint: { max: 500, min: 450 },
    items: 1,
    partialVisibilityGutter: 60
  },
  size_2: {
    breakpoint: { max: 450, min: 420 },
    items: 1,
    partialVisibilityGutter: 50
  },
  size_1: {
    breakpoint: { max: 420, min: 0 },
    items: 1,
    partialVisibilityGutter: 40
  }
}

export default function EndingSoon() {
  return (
    <section className="ending-soon">
      <Container className="header pb-4 homepage-container">
        <Row className="pb-5">
          <Col xs="12" lg="9" className="text-super">Ending soon</Col>
          <Col xs="12" lg="3" className="align-self-end pr-lg-0 ml-1 ml-lg-0">
            <a href="/" className="see-all-link float-lg-right text-label text-all-cups">See all auctions &gt;&gt;</a>
          </Col>
        </Row>
        <Carousel
          swipeable
          partialVisible
          infinite
          responsive={responsive}
          containerClass="carousel-container-with-scrollbar"
        >
          <div className="auction">
            <div className="like" />
            <Image className="auction-picture" src="/content/img/auctions/auction-item-1.png" />
            <div className="p-3">
              <div className="owner">
                <Image className="auction-owner-picture" src="/content/img/users/auction-owner-1.png" roundedCircle />
                <div className="text-sm mb-md-0 text-label text-all-cups pl-2 d-inline-block">De’aaron Fox</div>
              </div>
              <div className="auction-title text-subhead pt-2">De'Aaron Fox Autographed Game Worn Jersey</div>
              <div className="price text-body-super">$260.00</div>
              <div className="text-label text-all-cups pt-2">1 bid • 7d 21h</div>
            </div>
          </div>

          <div className="auction">
            <div className="like" />
            <Image className="auction-picture" src="/content/img/auctions/auction-item-2.png" />
            <div className="p-3">
              <div className="owner">
                <Image className="auction-owner-picture" src="/content/img/users/auction-owner-2.png" roundedCircle />
                <div className="text-sm mb-md-0 text-label text-all-cups pl-2 d-inline-block">Diego Rossi</div>
              </div>
              <div className="auction-title text-subhead pt-2">Diego Rossi Fox Signed Game Worn Jersey</div>
              <div className="price text-body-super">$11 000.00</div>
              <div className="text-label text-all-cups pt-2">10 bids • 3d 1h</div>
            </div>
          </div>

          <div className="auction">
            <div className="like" />
            <Image className="auction-picture" src="/content/img/auctions/auction-item-1.png" />
            <div className="p-3">
              <div className="owner">
                <Image className="auction-owner-picture" src="/content/img/users/auction-owner-1.png" roundedCircle />
                <div className="text-sm mb-md-0 text-label text-all-cups pl-2 d-inline-block">De’aaron Fox</div>
              </div>
              <div className="auction-title text-subhead pt-2">De'Aaron Fox Autographed Game Worn Jersey</div>
              <div className="price text-body-super">$260.00</div>
              <div className="text-label text-all-cups pt-2">1 bid • 7d 21h</div>
            </div>
          </div>

          <div className="auction">
            <div className="like" />
            <Image className="auction-picture" src="/content/img/auctions/auction-item-2.png" />
            <div className="p-3">
              <div className="owner">
                <Image className="auction-owner-picture" src="/content/img/users/auction-owner-2.png" roundedCircle />
                <div className="text-sm mb-md-0 text-label text-all-cups pl-2 d-inline-block">Diego Rossi</div>
              </div>
              <div className="auction-title text-subhead pt-2">Diego Rossi Fox Signed Game Worn Jersey</div>
              <div className="price text-body-super">$11 000.00</div>
              <div className="text-label text-all-cups pt-2">10 bids • 3d 1h</div>
            </div>
          </div>
        </Carousel>
      </Container>
    </section>
  )
}
