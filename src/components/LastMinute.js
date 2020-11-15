import React from 'react'
import Link from 'next/link'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'

import Swiper from './Swiper'

const LastMinute = (props) => {
  return (
    <section className={`py-6 ${props.greyBackground ? 'bg-gray-100' : ''}`}>
      <Container>
        <Row className="mb-5">
          <Col md="8">
            <p className="subtitle text-secondary">Take a look before it's gone</p>
            <h2>Ending soon</h2>
          </Col>
          <Col
            md="4"
            className="d-lg-flex align-items-center justify-content-end">
            <Link href="/auctions">
              <a className="text-muted text-sm">
                See more auctions
                <i className="fas fa-angle-double-right ml-2" />
              </a>
            </Link>
          </Col>
        </Row>
        <Swiper
          className="swiper-container-mx-negative pt-3 pb-5"
          perView={1}
          spaceBetween={20}
          roundLengths
          md={2}
          lg={3}
          xl={4}
          data={props.data}
          auctions
          loop
        />
      </Container>
    </section>
  )
};

export default LastMinute;