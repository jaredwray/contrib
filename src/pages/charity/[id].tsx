import React from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Media, CardText, Badge } from 'reactstrap'
import CardAuction from 'src/components/CardAuction'
import GalleryAbsolute from 'src/components/GalleryAbsolute'
import { connectToDatabase } from 'src/services/mongodb'
import { Error404, getStaticProps } from 'src/pages/404'

export async function getServerSideProps(context) {
    const { id } = context.query
    const { docs } = await connectToDatabase()
    const charity = await docs.charities().findOne({ _id: id })
    if (!charity) return getStaticProps()

    const now = new Date()
    const [activeAuctions, recentAuctions] = await Promise.all([
        docs.auctions().find({ "charities.id": id, endAt: { $gt: now } }).toArray(),
        docs.auctions().find({ "charities.id": id, endAt: { $lt: now } }).sort({ endAt: -1 }).toArray()
    ])

    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: charity.name,
            charity: JSON.parse(JSON.stringify(charity)),
            activeAuctions: JSON.parse(JSON.stringify(activeAuctions)),
            recentAuctions: JSON.parse(JSON.stringify(recentAuctions))
        },
    }
}

const CharityProfile = (props) => {
    const charity = props.charity
    const activeAuctions = props.activeAuctions
    const recentAuctions = props.recentAuctions
    if (charity == null) return <Error404 />

    return (
        <section className="py-5">
            <Container>
                <Row>
                    <Col lg="3" className="mr-lg-auto">
                        <Card className="border-0 shadow mb-6 mb-lg-0">
                            <CardHeader className="bg-gray-100 py-4 border-0 text-center">
                                <a href="#" className="d-inline-block">
                                    <img src={`${charity.avatar.medium}`} alt="" className="d-block avatar avatar-xxl p-2 mb-2" />
                                </a>
                                <h5>{charity.name}</h5>
                                <p className="text-muted text-sm mb-0">
                                    {charity.location.city}
                                </p>
                            </CardHeader>
                            <CardBody className="p-4">
                                <Media className="align-items-center mb-3">
                                    <div className={`icon-rounded icon-rounded-sm ${charity.verified ? "bg-primary-light" : "bg-gray-200"} mr-2`}>
                                        <svg className={`svg-icon ${charity.verified ? "text-primary" : "text-muted"} svg-icon-md`}>
                                            <use xlinkHref={`/content/svg/orion-svg-sprite.svg#${charity.verified ? "checkmark-1" : "close-1"}`}> </use>
                                        </svg>
                                    </div>
                                    <Media body>
                                        <p className="mb-0">{charity.verified ? "Verified" : "Unverified"} Charity</p>
                                    </Media>
                                </Media>
                                <hr />
                                {charity.joined &&
                                    <Badge color="secondary-light">
                                        Joined in {new Date(charity.joined).getFullYear()}
                                    </Badge>
                                }
                                {charity.social &&
                                    <React.Fragment>
                                        <hr />
                                        <h6>
                                            Follow them at
                                        </h6>
                                        <CardText tag="ul" className="list-unstyled">
                                            {charity.officialSite && <li className="text-primary"><i className="fas fa-globe" /> <a href={charity.officialSite} title={`${charity.name} official site`}>Website</a></li>}
                                            {charity.social.twitter && <li className="text-primary"><i className="fab fa-twitter" /> <a href={`https://twitter.com/${charity.social.twitter}`} title={`${charity.name} on Twitter`} target="_blank">{charity.social.twitter}</a></li>}
                                            {charity.social.facebook && <li className="text-primary"><i className="fab fa-facebook" /> <a href={`https://facebook.com/${charity.social.facebook}`} title={`${charity.name} on Facebook`} target="_blank">{charity.social.facebook}</a></li>}
                                            {charity.social.instagram && <li className="text-primary"><i className="fab fa-instagram" /> <a href={`https://instagram.com/${charity.social.instagram}`} title={`${charity.name} on Instagram`} target="_blank">{charity.social.instagram}</a></li>}
                                            {charity.social.youtube && <li className="text-primary"><i className="fab fa-youtube" /> <a href={`https://youtube.com/user/${charity.social.youtube}`} title={`${charity.name} on YouTube`} target="_blank">{charity.social.youtube}</a></li>}
                                        </CardText>
                                    </React.Fragment>
                                }
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="9" className="pl-lg-5">
                        <h1 className="hero-heading mb-3">{charity.name}</h1>
                        <div className="text-block">
                            <div dangerouslySetInnerHTML={{ __html: charity.description }} />
                        </div>
                        {charity.photos &&
                            <div className="text-block">
                                <h3 className="mb-4">Gallery</h3>
                                <GalleryAbsolute
                                    rowClasses="ml-n1 mr-n1"
                                    lg="4"
                                    xs="6"
                                    colClasses="px-1 mb-2"
                                    data={charity.photos}
                                />
                            </div>
                        }
                        {activeAuctions.length > 0 ?
                            <div className="text-block">
                                <h3 className="mb-5">
                                    Auctions benefiting {charity.name}
                                </h3>
                                <Row>
                                    {activeAuctions.map(auction =>
                                        <Col sm="6" lg="4" className="mb-30px hover-animate" key={auction._id}>
                                            <CardAuction data={auction} />
                                        </Col>
                                    )}
                                </Row>
                            </div>
                            :
                            <div className="text-block">
                                <h4 className="mb-3">
                                    No items up for auction right now
                                </h4>
                                <p>Check back again soon!</p>
                            </div>
                        }
                        {recentAuctions.length > 0 &&
                            <div className="text-block">
                                <h3 className="mb-5">
                                    Recent auctions for {charity.name}
                                </h3>
                                <Row>
                                    {recentAuctions.map(auction =>
                                        <Col sm="6" lg="4" className="mb-30px hover-animate" key={auction._id}>
                                            <CardAuction data={auction} />
                                        </Col>
                                    )}
                                </Row>
                            </div>
                        }
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default CharityProfile