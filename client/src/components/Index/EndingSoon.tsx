import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import Carousel from 'react-multi-carousel'

import 'react-multi-carousel/lib/styles.css'
import './EndingSoon.scss'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    partialVisibilityGutter: 30
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
      <Container className="header pb-4 homepage-container">
        <Row>
          <Col xs="12" lg="9" className="text-super">Ending soon</Col>
          <Col xs="12" lg="3" className="align-self-end pr-lg-0 ml-1 ml-lg-0">
            <a href="/" className="see-all-link float-lg-right text-label text-all-cups">See all auctions &gt;&gt;</a>
          </Col>
        </Row>
      </Container>

      <Carousel
        swipeable
        partialVisible
        infinite
        responsive={responsive}
        containerClass="carousel-container-with-scrollbar"
        className="auctions"
      >
        <div className="auction">
          <div className="like" />
          <Image className="auction-picture" src="/content/img/auctions/auction-item-1.png" />
          <div className="p-3">
            <div className="owner">
              <Image className="owner-picture" src="/content/img/users/auction-owner-1.png" roundedCircle />
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
              <Image className="owner-picture" src="/content/img/users/auction-owner-2.png" roundedCircle />
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
              <Image className="owner-picture" src="/content/img/users/auction-owner-1.png" roundedCircle />
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
              <Image className="owner-picture" src="/content/img/users/auction-owner-2.png" roundedCircle />
              <div className="text-sm mb-md-0 text-label text-all-cups pl-2 d-inline-block">Diego Rossi</div>
            </div>
            <div className="auction-title text-subhead pt-2">Diego Rossi Fox Signed Game Worn Jersey</div>
            <div className="price text-body-super">$11 000.00</div>
            <div className="text-label text-all-cups pt-2">10 bids • 3d 1h</div>
          </div>
        </div>
      </Carousel>
    </section>
  )
}
