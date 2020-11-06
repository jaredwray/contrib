import React from 'react'
import Link from 'next/link'

import {
    Container,
    Row,
    Col,
    Card,
} from 'reactstrap'

import data from '../data/popular_cities.json'

const PopularCities = props => {

    return (
        <section className={`py-6 ${props.greyBackground ? 'bg-gray-100' : ''}`}>
            <Container>
                <Row className="mb-5">
                    <Col md="8">
                        <p className="subtitle text-primary">{props.subTitle}</p>
                        <h2>{props.title}</h2>
                    </Col>
                    <Col md="4" className="d-md-flex align-items-center justify-content-end">
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
                <Row>
                    {data.cities && data.cities.map((city, index) =>
                        <Col key={index} lg={index === 0 ? "8" : "4"} className="d-flex align-items-lg-stretch mb-4">
                            <Card
                                style={{
                                    background: `url(content/${city.img}) no-repeat center`,
                                    backgroundSize: 'cover'
                                }}
                                className="shadow-lg border-0 w-100 border-0 hover-animate"
                            >
                                <Link href={city.link}><a className="tile-link" /></Link>
                                <div className="d-flex align-items-center h-100 text-white justify-content-center py-6 py-lg-7">
                                    <h3 className="text-shadow text-uppercase mb-0">
                                        {city.title}
                                    </h3>
                                </div>
                            </Card>
                        </Col>
                    )}

                </Row>
            </Container>
        </section>
    )
};

export default PopularCities;