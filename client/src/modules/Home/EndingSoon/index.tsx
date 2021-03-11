import React from 'react';

import { Container, Row, Col, Image } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';

import './styles.scss';

const responsive = {
  size_1261_6000: {
    breakpoint: { max: 6000, min: 1261 },
    items: 3,
    partialVisibilityGutter: 80,
  },
  size_1066_1260: {
    breakpoint: { max: 1260, min: 1066 },
    items: 3,
    partialVisibilityGutter: 20,
  },
  size_891_1065: {
    breakpoint: { max: 1065, min: 891 },
    items: 2,
    partialVisibilityGutter: 90,
  },
  size_801_890: {
    breakpoint: { max: 890, min: 801 },
    items: 2,
    partialVisibilityGutter: 20,
  },
  size_701_800: {
    breakpoint: { max: 800, min: 701 },
    items: 2,
    partialVisibilityGutter: 0,
  },
  size_621_700: {
    breakpoint: { max: 700, min: 621 },
    items: 1,
    partialVisibilityGutter: 250,
  },
  size_577_620: {
    breakpoint: { max: 620, min: 577 },
    items: 1,
    partialVisibilityGutter: 200,
  },
  size_501_576: {
    breakpoint: { max: 576, min: 501 },
    items: 1,
    partialVisibilityGutter: 180,
  },
  size_451_500: {
    breakpoint: { max: 500, min: 451 },
    items: 1,
    partialVisibilityGutter: 60,
  },
  size_421_450: {
    breakpoint: { max: 450, min: 421 },
    items: 1,
    partialVisibilityGutter: 50,
  },
  size_0_420: {
    breakpoint: { max: 420, min: 0 },
    items: 1,
    partialVisibilityGutter: 40,
  },
};

export default function EndingSoon() {
  return (
    <section className="ending-soon">
      <Container className="header pb-4 homepage-container">
        <Row className="pb-5">
          <Col className="text-super" lg="9" xs="12">
            Ending soon
          </Col>
          <Col className="align-self-end pr-lg-0 ml-1 ml-lg-0" lg="3" xs="12">
            <Link className="see-all-link float-lg-right text-label text-all-cups" to="/auctions">
              See all auctions &gt;&gt;
            </Link>
          </Col>
        </Row>
        <Carousel
          infinite
          partialVisible
          swipeable
          containerClass="carousel-container-with-scrollbar"
          responsive={responsive}
        >
          <div className="auction">
            <div className="like" />
            <Image className="auction-picture" src="/content/img/auctions/auction-item-1.webp" />
            <div className="p-3">
              <div className="owner">
                <Image roundedCircle className="auction-owner-picture" src="/content/img/users/auction-owner-1.webp" />
                <div className="text-sm mb-md-0 text-label text-all-cups pl-2 d-inline-block">De’aaron Fox</div>
              </div>
              <div className="auction-title text-subhead pt-2">De'Aaron Fox Autographed Game Worn Jersey</div>
              <div className="price text-body-super">$260.00</div>
              <div className="text-label text-all-cups pt-2">1 bid • 7d 21h</div>
            </div>
          </div>

          <div className="auction">
            <div className="like" />
            <Image className="auction-picture" src="/content/img/auctions/auction-item-2.webp" />
            <div className="p-3">
              <div className="owner">
                <Image roundedCircle className="auction-owner-picture" src="/content/img/users/auction-owner-2.webp" />
                <div className="text-sm mb-md-0 text-label text-all-cups pl-2 d-inline-block">Diego Rossi</div>
              </div>
              <div className="auction-title text-subhead pt-2">Diego Rossi Fox Signed Game Worn Jersey</div>
              <div className="price text-body-super">$11 000.00</div>
              <div className="text-label text-all-cups pt-2">10 bids • 3d 1h</div>
            </div>
          </div>

          <div className="auction">
            <div className="like" />
            <Image className="auction-picture" src="/content/img/auctions/auction-item-1.webp" />
            <div className="p-3">
              <div className="owner">
                <Image roundedCircle className="auction-owner-picture" src="/content/img/users/auction-owner-1.webp" />
                <div className="text-sm mb-md-0 text-label text-all-cups pl-2 d-inline-block">De’aaron Fox</div>
              </div>
              <div className="auction-title text-subhead pt-2">De'Aaron Fox Autographed Game Worn Jersey</div>
              <div className="price text-body-super">$260.00</div>
              <div className="text-label text-all-cups pt-2">1 bid • 7d 21h</div>
            </div>
          </div>

          <div className="auction">
            <div className="like" />
            <Image className="auction-picture" src="/content/img/auctions/auction-item-2.webp" />
            <div className="p-3">
              <div className="owner">
                <Image roundedCircle className="auction-owner-picture" src="/content/img/users/auction-owner-2.webp" />
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
  );
}
