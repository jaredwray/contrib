import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import UseWindowSize from '../hooks/UseWindowSize'

import {
    Container,
    Row,
    Col,
    Button,
    Card,
    CardHeader,
    Media,
    CardBody,
    Table,
    Badge
} from 'reactstrap'

import Swiper from "../components/Swiper"

import Stars from '../components/Stars'
import Reviews from '../components/Reviews'
import ReviewForm from '../components/ReviewForm'
import Gallery from '../components/Gallery'

import data from '../data/detail.json'
import geoJSON from '../data/restaurants-geojson.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: 'Restaurant detail'
        },
    }
}

let Map
export default () => {
    const [mapLoaded, setMapLoaded] = React.useState(false)
    const [dragging, setDragging] = React.useState(false)
    const [tap, setTap] = React.useState(false)

    const [reviewCollapse, setReviewCollapse] = React.useState(false)

    const size = UseWindowSize()

    React.useEffect(() => {
        Map = dynamic(
            () => import('../components/Map'),
            { ssr: false }
        )
        setMapLoaded(true)

        setTap(size.width > 700 ? true : false)
        setDragging(size.width > 700 ? true : false)
    }, [])

    return (
        <React.Fragment>
            <section
                style={data.img && { backgroundImage: `url(content/img/photo/${data.img})` }}
                className="pt-7 pb-5 d-flex align-items-end dark-overlay bg-cover"
            >
                <Container className="overlay-content">
                    <div className="d-flex justify-content-between align-items-start flex-column flex-lg-row align-items-lg-end">
                        <div className="text-white mb-4 mb-lg-0">
                            {data.category &&
                                <Badge pill color="transparent" className="px-3 py-2 mb-4">
                                    {data.category}
                                </Badge>
                            }
                            {data.title &&
                                <h1 className="text-shadow verified">
                                    {data.title}
                                </h1>
                            }
                            {data.location &&
                                <p>
                                    <i className="fa-map-marker-alt fas mr-2" />
                                    {data.location}
                                </p>
                            }

                            <p className="mb-0 d-flex align-items-center">
                                {data.stars &&
                                    <Stars
                                        stars={data.stars}
                                        size="xs"
                                        color="text-primary"
                                    />
                                }
                                {data.reviewsNumber && <span className="ml-4">{data.reviewsNumber + ' Reviews'}</span>}
                            </p>
                        </div>
                        <div className="calltoactions">
                            <Button
                                href="#leaveReview"
                                color="primary"
                                onClick={() => setReviewCollapse(!reviewCollapse)}
                                data-smooth-scroll
                            >
                                Leave a Review
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>
            <section className="py-6">
                <Container>
                    <Row>
                        <Col lg="8">
                            <div className="text-block">
                                <h3 className="mb-3">
                                    About
                                </h3>
                                {data.content1 &&
                                    <p className="text-muted">
                                        {data.content1}
                                    </p>
                                }
                                {data.content2 &&
                                    <p className="text-muted">
                                        {data.content2}
                                    </p>
                                }
                            </div>
                            <div className="text-block">
                                <h3 className="mb-4">Location</h3>
                                <div className="map-wrapper-300 mb-3">
                                    {mapLoaded &&
                                        <Map
                                            className="h-100"
                                            center={[40.732346, -74.0014247]}
                                            markerPosition={[40.732346, -74.0014247]}
                                            zoom={16}
                                            dragging={dragging}
                                            tap={tap}
                                        />
                                    }
                                </div>
                            </div>
                            {data.gallery &&
                                <div className="text-block">
                                    <h3 className="mb-4">Gallery</h3>
                                    <Gallery
                                        rowClasses="ml-n1 mr-n1"
                                        lg="4"
                                        xs="6"
                                        colClasses="px-1 mb-2"
                                        data={data.gallery}

                                    />
                                </div>
                            }
                            {data.amenities &&
                                <div className="text-block">
                                    <h3 className="mb-4">Amenities</h3>
                                    <ul className="amenities-list list-inline">
                                        {data.amenities.map(amenity =>
                                            <li
                                                key={amenity}
                                                className="list-inline-item mb-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="icon-circle bg-secondary mr-2">
                                                        <i className="fa fa-check" />
                                                    </div>
                                                    <span>
                                                        {amenity}
                                                    </span>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            }
                            {data.reviews &&
                                <Reviews data={data.reviews} />
                            }
                            <ReviewForm />
                        </Col>
                        <Col lg="4">
                            <div className="pl-xl-4">
                                {data.openingHours &&
                                    <Card className="border-0 shadow mb-5">
                                        <CardHeader className="bg-gray-100 py-4 border-0">
                                            <Media className="align-items-center">
                                                <Media body>
                                                    <p className="subtitle text-sm text-primary">
                                                        Opening in 5 minutes
                                                </p>
                                                    <h4 className="mb-0">Opening Hours </h4>
                                                </Media>
                                                <svg className="svg-icon svg-icon svg-icon-light w-3rem h-3rem ml-3 text-muted">
                                                    <use xlinkHref="content/svg/orion-svg-sprite.svg#wall-clock-1" />
                                                </svg>
                                            </Media>
                                        </CardHeader>
                                        <CardBody>
                                            <Table className="text-sm mb-0">
                                                <tbody>
                                                    {data.openingHours.map((item, index) =>
                                                        <tr key={item.day}>
                                                            <th className={`pl-0 ${index === 0 ? "border-0" : ""}`}>{item.day}
                                                            </th>
                                                            <td className={`pr-0 text-right ${index === 0 ? "border-0" : ""}`}>{item.hours}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </CardBody>
                                    </Card>
                                }
                                {data.contacts &&
                                    <Card className="border-0 shadow mb-5">
                                        <CardHeader className="bg-gray-100 py-4 border-0">
                                            <Media className="align-items-center">
                                                <Media body>
                                                    <p className="subtitle text-sm text-primary">
                                                        Drop Us a Line
                                                    </p>
                                                    <h4 className="mb-0">
                                                        Contact
                                                    </h4>
                                                </Media>
                                                <svg className="svg-icon svg-icon svg-icon-light w-3rem h-3rem ml-3 text-muted">
                                                    <use xlinkHref="content/svg/orion-svg-sprite.svg#fountain-pen-1" />
                                                </svg>
                                            </Media>
                                        </CardHeader>
                                        <CardBody>
                                            <ul className="list-unstyled mb-4">
                                                {data.contacts.map(contact =>
                                                    <li key={contact.icon} className="mb-2">
                                                        <Link href={contact.link}>
                                                            <a className="text-gray-00 text-sm text-decoration-none">
                                                                <i className={`${contact.icon} mr-3`} />
                                                                <span className="text-muted">{contact.content}
                                                                </span>
                                                            </a>
                                                        </Link>
                                                    </li>
                                                )}
                                            </ul>
                                            <div className="text-center">
                                                <Button
                                                    href="#"
                                                    color="outline-primary"
                                                    block
                                                >
                                                    <i className="far fa-paper-plane mr-2" />
                                                        Send a Message
                                                </Button>
                                            </div>
                                        </CardBody>

                                    </Card>

                                }
                                <div className="text-center">
                                    <p>
                                        <a href="#" className="text-secondary">
                                            <i className="fa fa-heart" /> Bookmark This Listing
                                        </a>
                                    </p>
                                    <span>79 people bookmarked this place </span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            {data.similar &&
                <section className="py-6 bg-gray-100">
                    <Container>
                        <h5 className="mb-0">{data.similar.title}</h5>
                        <p className="subtitle text-sm text-primary mb-4">
                            {data.similar.subtitle}
                        </p>
                        <Swiper
                            className="swiper-container-mx-negative items-slider pb-5"
                            perView={1}
                            spaceBetween={20}
                            loop
                            roundLengths
                            md={2}
                            lg={3}
                            xl={4}
                            data={geoJSON.features}
                            restaurantCards
                        />
                    </Container>
                </section>
            }

        </React.Fragment>
    )

}