import React from 'react'

import Link from 'next/link'


import {
    Container,
    Row,
    Col,
    Button,
} from 'reactstrap'


import RichSwiper from '../components/RichSwiper'

import SearchBar from '../components/SearchBar'

import LastMinute from '../components/LastMinute'
import Guides from '../components/Guides'
import Instagram from '../components/Instagram'

import data from '../data/index3.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                dark: true,
                fixed: "false",
                color: "transparent"
            },
            noPaddingTop: true,
            headerClasses: "header-absolute",
            title: "Travel"
        },
    }
}

const Index3 = () => {
    return (
        <React.Fragment>
            <RichSwiper
                className="multi-slider"
                data={data.swiper}
                perView={1}
                spaceBetween={0}
                centeredSlides
                loop
                speed={1500}
                parallax
                paginationClass="swiper-pagination-white"
            />
            {data.numberedBlocks &&
                <section className="py-6">
                    <Container>
                        <Row>
                            {data.numberedBlocks.map((block, index) =>
                                <Col
                                    lg="4"
                                    className="px-5"
                                    key={index}
                                >
                                    <p className="advantage-number">
                                        {index + 1}
                                    </p>
                                    <div className="pl-lg-5">
                                        <h6 className="text-uppercase">
                                            {block.title}
                                        </h6>
                                        <p className="text-muted text-sm mb-5 mb-lg-0">
                                            {block.content}
                                        </p>
                                    </div>
                                </Col>
                            )}

                        </Row>
                    </Container>
                </section>
            }
            <section className="bg-gray-100">
                {data.imageDivider &&
                    <div
                        style={{ height: "250px", backgroundImage: `url(content/${data.imageDivider}` }}
                        className="bg-cover"
                    />
                }
                <Container className="pb-lg-3">
                    <SearchBar
                        options={data.searchOptions}
                        className="rounded p-3 p-lg-4 position-relative mt-n4 z-index-20"
                        halfInputs={true}
                        btnMb="0"
                    />
                </Container>

            </section>

            <Guides greyBackground />

            {data.popular &&
                <section className="pt-6">
                    <Container>
                        <Row className="mb-6">
                            <Col lg="8">
                                <h2>{data.popular.title}</h2>
                                <p className="text-muted mb-0">
                                    {data.popular.content}
                                </p>
                            </Col>

                        </Row>
                    </Container>
                    <Container fluid>
                        <Row>
                            {data.popular.places.map((place, index) =>
                                <Col
                                    xs="6"
                                    lg="4"
                                    xl="3"
                                    className={`px-0 ${index === data.popular.places.length - 1 ? 'd-none d-lg-block d-xl-none' : ''}`}
                                    key={index}
                                >
                                    <div
                                        style={{ minHeight: "400px" }}
                                        className="d-flex align-items-center dark-overlay hover-scale-bg-image">
                                        <img
                                            src={`/content/${place.img}`}
                                            alt={place.title}
                                            className="bg-image"
                                        />
                                        <div className="p-3 p-sm-5 text-white z-index-20"
                                        >
                                            <h4 className="h2">
                                                {place.title}
                                            </h4>
                                            <p className="mb-4">
                                                {place.subTitle}
                                            </p>
                                            <Link href={place.link}>
                                                <Button href={place.link}
                                                    color="link"
                                                    className="text-reset pl-0 stretched-link text-decoration-none"
                                                >
                                                    {data.popular.button}
                                                    <i className="fa fa-chevron-right ml-2" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </Container>
                </section>
            }
            <LastMinute />
            <Instagram />
        </React.Fragment>

    )
};

export default Index3;


