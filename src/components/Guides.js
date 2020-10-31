import React from 'react'
import Link from 'next/link'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'

import Swiper from './Swiper'

import data from '../data/guides.json'

export default props => {
  return (
    <section className={`py-6 ${props.greyBackground ? 'bg-gray-100' : ''}`}>
      <Container>
        <Row className="mb-5">
          <Col md="8">
            <p className="subtitle text-primary">{data.subTitle}</p>
            <h2>{data.title}</h2>
          </Col>
          <Col md="4" className="d-lg-flex align-items-center justify-content-end">
            {data.buttonLink &&
              <Link href={data.buttonLink}>
                <a className="text-muted text-sm">
                  {data.button}
                  <i className="fas fa-angle-double-right ml-2" />
                </a>
              </Link>
            }
          </Col>
        </Row>
        <Swiper
          className="guides-slider mx-n2 pt-3 pb-5"
          perView={1}
          spaceBetween={20}
          imgCards
          loop
          roundLengths
          md={2}
          lg={4}
          xl={5}
          data={data.swiperItems}

        />

      </Container>
    </section>
  )
}