import React from 'react'

import { Container, Row, Col, Card, CardHeader, CardBody, Media, CardText, Badge } from 'reactstrap'

import data from '../data/user-profile.json'
import geoJSON from '../data/rooms-geojson.json'

import CardRoom from '../components/CardRoom'
import Reviews from '../components/Reviews'
import ReviewForm from '../components/ReviewForm'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggedUser: true,
            title: "User Profile"
        },
    }
}

export default () => {
    return (
        <section className="py-5">
            <Container>
                <Row>
                    <Col lg="3" className="mr-lg-auto">
                        <Card className="border-0 shadow mb-6 mb-lg-0">
                            <CardHeader className="bg-gray-100 py-4 border-0 text-center">
                                <a href="#" className="d-inline-block">
                                    <img src={`/content/img/avatar/${data.avatar}`} alt="" className="d-block avatar avatar-xxl p-2 mb-2" />
                                </a>
                                <h5>{data.firstname} {data.lastname}</h5>
                                <p className="text-muted text-sm mb-0">
                                    {data.location}
                                </p>
                            </CardHeader>
                            <CardBody className="p-4">
                                <Media className="align-items-center mb-3">
                                    <div className="icon-rounded icon-rounded-sm bg-primary-light mr-2">
                                        <svg className="svg-icon text-primary svg-icon-md">
                                            <use xlinkHref="/content/svg/orion-svg-sprite.svg#diploma-1"> </use>
                                        </svg>
                                    </div>
                                    <Media body>
                                        <p className="mb-0">{data.reviewsnumber} reviews</p>
                                    </Media>
                                </Media>
                                <Media className="align-items-center mb-3">
                                    <div className={`icon-rounded icon-rounded-sm ${data.verified ? "bg-primary-light" : "bg-gray-200"} mr-2`}>
                                        <svg className={`svg-icon ${data.verified ? "text-primary" : "text-muted"} svg-icon-md`}>
                                            <use xlinkHref={`/content/svg/orion-svg-sprite.svg#${data.verified ? "checkmark-1" : "close-1"}`}> </use>
                                        </svg>
                                    </div>
                                    <Media body>
                                        <p className="mb-0">{data.verified ? "Verified" : "Unverified"}</p>
                                    </Media>
                                </Media>
                                <hr />
                                <h6>
                                    {data.firstname} provided
                                </h6>
                                <CardText className="text-muted" tag="ul">
                                    {data.provided.map(item =>
                                        <li key={item}>{item}</li>
                                    )}
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="9" className="pl-lg-5">
                        <h1 className="hero-heading mb-0">Hello, I'm {data.firstname}!</h1>
                        <div className="text-block">
                            <p>
                                <Badge color="secondary-light">
                                    Joined in {data.date}
                                </Badge>
                            </p>
                            <div dangerouslySetInnerHTML={{ __html: data.content }} />
                        </div>
                        <div className="text-block">
                            <h4 className="mb-5">
                                {data.firstname}'s Listings
                            </h4>
                            <Row>
                                {geoJSON.features.map(listing =>
                                    <Col sm="6" lg="4" className="mb-30px hover-animate" key={listing.properties.name}>
                                        <CardRoom data={listing.properties} />
                                    </Col>
                                )}

                            </Row>
                        </div>
                        <div className="text-block">
                            <Reviews data={data.reviews} />
                            <ReviewForm />
                        </div>
                    </Col>
                </Row>

            </Container>
        </section>
    )
}