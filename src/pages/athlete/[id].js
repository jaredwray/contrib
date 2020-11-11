import React from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Media, CardText, Badge } from 'reactstrap'
import CardAuction from '../../components/CardAuction'
import { connectToDatabase } from '../../../utils/mongodb'
import Error404 from '../404'

export async function getServerSideProps(context) {
    const { id } = context.query
    const { docs } = await connectToDatabase()
    const athlete = await docs.athletes().findOne({ _id: id })
    const auctions = await docs.auctions().find({ "seller.id": id }).toArray()

    return {
        props: {            
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggedUser: true,
            title: athlete ? athlete.name : "404 Not Found",
            athlete: athlete,
            auctions: JSON.parse(JSON.stringify(auctions))
        },
    }
}

const UserProfile = (props) => {
    const athlete = props.athlete
    if (athlete == null) return <Error404 />

    return (
        <section className="py-5">
            <Container>
                <Row>
                    <Col lg="3" className="mr-lg-auto">
                        <Card className="border-0 shadow mb-6 mb-lg-0">
                            <CardHeader className="bg-gray-100 py-4 border-0 text-center">
                                <a href="#" className="d-inline-block">
                                    <img src={`${athlete.avatar.medium}`} alt="" className="d-block avatar avatar-xxl p-2 mb-2" />
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
                                {athlete.social &&
                                    <React.Fragment>
                                    <hr />
                                    <h6>
                                        Follow {athlete.firstName} on
                                    </h6>
                                    <CardText tag="ul" className="list-unstyled">
                                        {athlete.social.twitter && <li className="text-primary"><i className="fab fa-twitter"/> <a href={`https://twitter.com/${athlete.social.twitter}`}>{athlete.social.twitter}</a></li>}
                                        {athlete.social.facebook && <li className="text-primary"><i className="fab fa-facebook"/> <a href={`https://facebook.com/${athlete.social.facebook}`}>{athlete.social.facebook}</a></li>}
                                        {athlete.social.instagram && <li className="text-primary"><i className="fab fa-instagram"/> <a href={`https://instagram.com/${athlete.social.instagram}`}>{athlete.social.instagram}</a></li>}
                                    </CardText>
                                    </React.Fragment>
                                }
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
                        { props.auctions ?
                            <div className="text-block">
                                <h4 className="mb-5">
                                    {athlete.firstName}'s items
                                </h4>
                                <Row>
                                    {props.auctions.map(auction =>
                                        <Col sm="6" lg="4" className="mb-30px hover-animate" key={auction._id}>
                                            <CardAuction data={auction} />
                                        </Col>
                                    )}
                                </Row>
                            </div>                        
                        :
                            <div className="text-block">
                                <h4 className="mb-3">
                                    {athlete.firstName} has no items up for auction right now
                                </h4>
                                <p>Check back again soon!</p>
                            </div>
                        }
                    </Col>
                </Row>
            </Container>
        </section>
    )
};

export default UserProfile;