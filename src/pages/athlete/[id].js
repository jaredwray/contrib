import React from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Media, CardText, Badge } from 'reactstrap'

import geoJSON from '../../data/rooms-geojson.json'
import CardRoom from '../../components/CardRoom'
import { connectToDatabase } from '../../../utils/mongodb'

export async function getServerSideProps(context) {
    const { id } = context.query
    const { docs } = await connectToDatabase()
    const athlete = await docs.athletes().findOne({ _id: id })
    return {
        props: {            
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggedUser: true,
            title: athlete.name,
            athlete: athlete
        },
    }
}

const UserProfile = (props) => {
    const athlete = props.athlete
    return (
        <section className="py-5">
            <Container>
                <Row>
                    <Col lg="3" className="mr-lg-auto">
                        <Card className="border-0 shadow mb-6 mb-lg-0">
                            <CardHeader className="bg-gray-100 py-4 border-0 text-center">
                                <a href="#" className="d-inline-block">
                                    <img src={`${athlete.avatar.small}`} alt="" className="d-block avatar avatar-xxl p-2 mb-2" />
                                </a>
                                <h5>{athlete.name}</h5>
                                <p className="text-muted text-sm mb-0">
                                    {athlete.location.city}
                                </p>
                            </CardHeader>
                            <CardBody className="p-4">
                                <Media className="align-items-center mb-3">
                                    <div className={`icon-rounded icon-rounded-sm ${athlete.verified ? "bg-primary-light" : "bg-gray-200"} mr-2`}>
                                        <svg className={`svg-icon ${athlete.verified ? "text-primary" : "text-muted"} svg-icon-md`}>
                                            <use xlinkHref={`/content/svg/orion-svg-sprite.svg#${athlete.verified ? "checkmark-1" : "close-1"}`}> </use>
                                        </svg>
                                    </div>
                                    <Media body>
                                        <p className="mb-0">{athlete.verified ? "Verified" : "Unverified"} Athlete</p>
                                    </Media>
                                </Media>
                                <hr />
                                <h6>
                                    {athlete.firstName}'s social
                                </h6>
                                <CardText tag="ul">
                                    {Object.entries(athlete.social).map(kv =>
                                        <li key={kv[0]}>{kv[1]}</li>
                                    )}
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="9" className="pl-lg-5">
                        <h1 className="hero-heading mb-0">{athlete.name}</h1>
                        <div className="text-block">
                            <p>
                                <Badge color="secondary-light">
                                    Joined in {new Date(athlete.joined).getFullYear()}
                                </Badge>
                            </p>
                            <div dangerouslySetInnerHTML={{ __html: athlete.description }} />
                        </div>
                        <div className="text-block">
                            <h4 className="mb-5">
                                {athlete.firstName}'s Listings
                            </h4>
                            <Row>
                                {geoJSON.features.map(listing =>
                                    <Col sm="6" lg="4" className="mb-30px hover-animate" key={listing.properties.name}>
                                        <CardRoom data={listing.properties} />
                                    </Col>
                                )}

                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
};

export default UserProfile;