import React from 'react'

import {
  Container,
  Row,
  Col,
} from 'reactstrap'

import Swiper from '../components/Swiper'
import SearchBar from '../components/SearchBar'
import LastMinute from '../components/LastMinute'

import SwiperTestimonial from '../components/SwiperTestimonial'

import data from '../data/index.json'

export async function getStaticProps() {
  return {
    props: {
      nav: {
        light: true,
        classes: "shadow",
        color: "white",
      },
      title: 'Homepage'
    },
  }
}

const Index = () => {
  return (
    <React.Fragment>
      <section className="hero-home" style={{ backgroundImage: `url(content/img/photo/${data.swiperPoster})` }}>

        <Swiper
          className="hero-slider"
          wrapperClasses="dark-overlay"
          data={data.swiperImages}
          simple={true}
          effect='fade'
          speed={2000}
          allowTouchMove={false}
          pagination={false}
          autoplay={true}
          delay={10000}
        />
        <Container className="py-6 py-md-7 text-white z-index-20">
          <Row>
            <Col xl="10">
              {data.hero &&
                <div className="text-center text-lg-left">
                  <p className="subtitle letter-spacing-4 mb-2 text-secondary text-shadow">
                    {data.hero.subTitle}
                  </p>
                  <h1 className="display-3 font-weight-bold text-shadow">
                    {data.hero.title}
                  </h1>
                </div>
              }
              <SearchBar
                options={data.searchOptions}
                className="mt-5 p-3 p-lg-1 pl-lg-4"
                btnClassName="rounded-xl"
              />
            </Col>
          </Row>
        </Container>
      </section>
      {data.topBlocks &&
        <section className="py-6 bg-gray-100">
          <Container>
            <div className="text-center pb-lg-4">
              <p className="subtitle text-secondary">{data.topBlocks.subTitle}</p>
              <h2 className="mb-5">{data.topBlocks.title}</h2>
            </div>
            <Row>
              {data.topBlocks.blocks.map(block =>
                <Col
                  key={block.title}
                  lg="4"
                  className="mb-3 mb-lg-0 text-center"
                >
                  <div className="px-0 px-lg-3">
                    <div className="icon-rounded bg-primary-light mb-3">
                      <svg className="svg-icon text-primary w-2rem h-2rem">
                        <use xlinkHref={`content/svg/orion-svg-sprite.svg${block.icon}`}> </use>
                      </svg>
                    </div>
                    <h3 className="h5">{block.title}</h3>
                    <p className="text-muted">{block.content}</p>
                  </div>
                </Col>
              )}
            </Row>
          </Container>
        </section>
      }
      <LastMinute greyBackground />
      {data.testimonials &&
        <section className="py-7">
          <Container>
            <div className="text-center">
              <p className="subtitle text-primary">
                {data.testimonials.subTitle}
              </p>
              <h2 className="mb-5">
                {data.testimonials.title}
              </h2>
            </div>
            <SwiperTestimonial data={data.testimonials.swiperItems} />
          </Container>
        </section>
      }
    </React.Fragment>
  )
};

export default Index;
