import React from 'react'
import Link from 'next/link'

import { Container, Row, Col, Card, CardBody, CardSubtitle, Breadcrumb, BreadcrumbItem } from 'reactstrap'

import data from '../data/user-grid.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggedUser: true,
            title: "Booking - grid view"
        },
    }
}

import Stars from '../components/Stars'

export default () => {
    return (
        <section className="py-5">
            <Container>
                <Breadcrumb listClassName="pl-0 justify-content-start">
                    <BreadcrumbItem>
                        <Link href="/">
                            <a>Home</a>
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        Your trips
                        </BreadcrumbItem>
                </Breadcrumb>

                <h1 className="hero-heading mb-4">
                    {data.title}
                </h1>
                <p className="text-muted mb-5">
                    {data.content}
                </p>
                <p className="mb-6">
                    <img src="/content/img/illustration/undraw_trip_dv9f.svg" alt="" style={{ width: "400px" }} className="img-fluid" />
                </p>
                <h2 className="mb-5">
                    Your past bookings
                    </h2>
                <Row>
                    {data.bookings.map(booking =>
                        <Col xl="3" md="4" sm="6" className="mb-5" key={booking.tile}>
                            <Card className="h-100 border-0 shadow">
                                <div className="card-img-top overflow-hidden">
                                    <Link href={booking.link}>
                                        <a>
                                            <img
                                                src={`/content/img/photo/${booking.img}`}
                                                alt={booking.title}
                                                className="img-fluid"
                                            />
                                        </a>
                                    </Link>
                                </div>
                                <CardBody className="d-flex align-items-center">
                                    <div className="w-100">
                                        <p className="subtitle font-weight-normal text-sm mb-2">{booking.date}</p>
                                        <h6 className="card-title">
                                            <Link href={booking.link}>
                                                <a className="text-decoration-none text-dark">
                                                    {booking.title}
                                                </a>
                                            </Link>
                                        </h6>
                                        <CardSubtitle className="d-flex mb-3">
                                            <p className="flex-grow-1 mb-0 text-muted text-sm">
                                                {booking.type}
                                            </p>
                                            <p className="flex-shrink-1 mb-0 card-stars text-xs text-right">
                                                <Stars stars={booking.stars} />
                                            </p>
                                        </CardSubtitle>

                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    )}

                </Row>
            </Container>
        </section>
    )
}