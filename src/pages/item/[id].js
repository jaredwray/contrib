import React from 'react'
import Link from 'next/link'
import 'react-dates/initialize'
import {
    Container,
    Row,
    Col,
    Form,
    Label,
    Input,
    Button,
    FormGroup,
    Media,
} from 'reactstrap'
import Swiper from '../../components/Swiper'
import data from '../../data/detail-rooms.json'
import GalleryAbsolute from '../../components/GalleryAbsolute'
import { connectToDatabase } from '../../../utils/mongodb'
import { ObjectID } from 'mongodb'
import Error404 from '../404'

export async function getServerSideProps(context) {
    const { id } = context.query
    const { docs } = await connectToDatabase()
    const auction = await docs.auctions().findOne({ _id: new ObjectID(id.toString()) })
    const athlete = await docs.athletes().findOne({ _id: auction.seller.id })

    return {
        props: {
            nav: {
                light: true,
                classes: 'shadow',
                color: 'white',
            },
            title: auction ? auction.title : '404 Not Found',
            auction: JSON.parse(JSON.stringify(auction)),
            seller: JSON.parse(JSON.stringify(athlete))
        },
    }
}

const ItemDetail = (props) => {
    const auction = props.auction
    const seller = props.seller
    if (auction == null) return <Error404 />

    return (
        <React.Fragment>
            <section>
                <Container className="py-5">
                    <Row>
                        <Col lg="8">
                            <div className="text-block">
                                <h1>
                                    {auction.title}
                                </h1>
                                {auction.category &&
                                    <div className="text-muted text-uppercase mb-4">
                                        {auction.category}
                                    </div>
                                }
                                <div className="text-muted font-weight-light" dangerouslySetInnerHTML={{ __html: auction.description }} />
                            </div>
                            {seller &&
                                <div className="text-block">
                                    <Media>
                                        <a href={`/athlete/${seller._id}`}><img src={seller.avatar.medium} alt={seller.name} className="avatar avatar-lg mr-4" /></a>
                                        <Media body>
                                            <p>
                                                <span className="text-muted text-uppercase text-sm">Auction by</span>
                                                <br />
                                                <strong>
                                                    <a href={`/athlete/${seller._id}`}>{seller.name}</a>
                                                </strong>
                                            </p>
                                            <div dangerouslySetInnerHTML={{ __html: seller.shortDescription }} />
                                            <p className="text-sm py-4">
                                                <Link href={`/athlete/${seller._id}`}>
                                                    <a>
                                                        See {seller.firstName}'s other listings <i className="fa fa-long-arrow-alt-right ml-2" />
                                                    </a>
                                                </Link>
                                            </p>
                                        </Media>
                                    </Media>
                                </div>
                            }
                            {auction.photos &&
                                <div className="text-block">
                                    <h3 className="mb-4">Gallery</h3>
                                    <GalleryAbsolute
                                        rowClasses="ml-n1 mr-n1"
                                        lg="4"
                                        xs="6"
                                        colClasses="px-1 mb-2"
                                        data={auction.photos}
                                    />
                                </div>
                            }
                        </Col>
                        <Col lg="4">
                            <div
                                style={{ top: "100px" }}
                                className="p-4 shadow ml-lg-4 rounded sticky-top">
                                <p className="text-muted">Ends at {new Date(auction.endAt).toLocaleString()}</p>
                                <span className="text-primary h2">
                                    ${auction.startPrice / 100}
                                </span>
                                <Form
                                    id="booking-form"
                                    method="get"
                                    action="#"
                                    autoComplete="off"
                                    className="form">
                                    <FormGroup>
                                        <Label className="form-label">Your bid</Label>
                                        <br />
                                        <Input type="text" name="bid" id="bid" />
                                        <p className="text-muted text-sm">Enter ${auction.startPrice / 100 + 1} or more</p>
                                    </FormGroup>
                                    <FormGroup>
                                        <Button type="submit" color="primary" block>Place your bid</Button>
                                    </FormGroup>
                                </Form>
                                <p className="text-muted text-sm text-center">Bidding means you're committing to buy this item if you're the winning bidder.</p>
                                <hr className="my-4" />
                                <div className="text-center">
                                    <p>
                                        <a href="#" className="text-secondary text-sm">
                                            <i className="fa fa-heart" /> &nbsp;Watch this auction
                                        </a>
                                    </p>
                                    <p className="text-muted text-sm">79 people are watching this auction.</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {data.similar &&
                <section className="py-6 bg-gray-100">
                    <Container>
                        <h5 className="mb-0">Similar items</h5>
                        <p className="subtitle text-sm text-primary mb-4">
                            {data.similar.subtitle}
                        </p>
                        <Swiper
                            className="swiper-container-mx-negative items-slider pb-5"
                            perView={1}
                            spaceBetween={20}
                            loop={true}
                            roundLengths={true}
                            md={2}
                            lg={3}
                            xl={4}
                            data={data.similar.items}
                            cards={true}
                        />
                    </Container>
                </section>
            }
        </React.Fragment>
    )
};

export default ItemDetail;