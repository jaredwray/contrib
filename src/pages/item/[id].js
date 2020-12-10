import React from 'react'
import Link from 'next/link'
import { Badge, Container, Row, Col, Form, Label, Input, Button, FormGroup, Media } from 'reactstrap'
import GalleryAbsolute from 'components/GalleryAbsolute'
import { connectToDatabase } from 'services/mongodb'
import { ObjectID } from 'mongodb'
import { Error404, getStaticProps } from 'pages/404'
import { getAuctionStatus, AuctionStatus } from 'models/database/auction'
import { getSession } from 'next-auth/client'
import { AutoBidder } from 'services/autobidder'
import { formatPrice, formatDate, formatRemaining } from 'services/formatting'
import { ObjectId } from 'mongodb'

export async function getServerSideProps(context) {
    const { id } = context.query
    const { docs } = await connectToDatabase()

    if (!ObjectID.isValid(id)) return getStaticProps()
    const auctionId = new ObjectID(id)
    const auction = await docs.auctions().findOne({ _id: auctionId })
    if (!auction) return getStaticProps()

    const autobidder = new AutoBidder(docs)
    const session = await getSession(context)

    const [athlete, charity, watchCount, watch, bidCount, highest, minToPlace] = await Promise.all([
        docs.athletes().findOne({ _id: auction.seller.id }),
        docs.charities().findOne({ _id: auction.charities[0].id }),
        docs.watches().count({ auctionId }),
        session ? docs.watches().findOne({ auctionId, buyerId: session.user.id }) : null,
        docs.highBids().count({ auctionId }) ?? 0,
        autobidder.GetHighestBid(auctionId),
        autobidder.GetMinBidPriceForAuctionUser(auction, new ObjectId(session.user.id))
    ])

    return {
        props: {
            nav: {
                light: true,
                classes: 'shadow',
                color: 'white',
            },
            title: auction.title,
            auction: JSON.parse(JSON.stringify(auction)),
            charity: JSON.parse(JSON.stringify(charity)),
            seller: JSON.parse(JSON.stringify(athlete)),
            bids: {
                minToPlace: minToPlace,
                highest: JSON.parse(JSON.stringify(highest)),
                count: bidCount,
                winning: highest?.buyerUserId === session?.user.id,
            },
            activity: {
                watchCount: watchCount,
                watching: watch !== null
            }
        }
    }
}

const ItemDetail = (props) => {
    const auction = props.auction
    if (auction == null) return <Error404 />

    const seller = props.seller
    const charity = props.charity
    const activity = props.activity
    const bids = props.bids
    const winning = props.bids.winning
    const auctionStatus = getAuctionStatus(auction)

    return (
        <React.Fragment>
            <section>
                <Container className="py-5">
                    <Row>
                        <Col lg="8">
                            <div className="text-block">
                                <h1>{auction.title}</h1>
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
                            {charity &&
                                <div className="text-block">
                                    <Media>
                                        <a href={`/charity/${charity._id}`}><img src={charity.avatar.medium} alt={charity.name} className="avatar avatar-lg mr-4" /></a>
                                        <Media body>
                                            <p>
                                                <span className="text-muted text-uppercase text-sm">Benefiting</span>
                                                <br />
                                                <strong>
                                                    <a href={`/charity/${charity._id}`}>{charity.name}</a>
                                                </strong>
                                            </p>
                                            <div dangerouslySetInnerHTML={{ __html: charity.shortDescription }} />
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
                            {auctionStatus !== AuctionStatus.Ended ?
                                <div
                                    style={{ top: "100px" }}
                                    className="p-4 shadow ml-lg-4 rounded sticky-top">
                                    <p className="text-muted">Ends in <span className="text-secondary">{formatRemaining(auction.endAt)}</span> on <span className="text-primary" title={new Date(auction.endAt).toLocaleString()}>{formatDate(auction.endAt)}</span>
                                    </p>
                                    <span className="text-primary h2">
                                        ${formatPrice(bids.highest?.price ?? auction.startPrice)}
                                    </span>
                                    <div className="text-muted text-sm">{bids.count} bids {winning && <span className="badge badge-secondary-light">You are winning</span>}
                                    </div>
                                    <Form
                                        id="booking-form"
                                        method="get"
                                        action="#"
                                        autoComplete="off"
                                        className="form mt-3">
                                        <Input type="hidden" name="auctionId" id="auctionId" value={auction._id} />
                                        <FormGroup>
                                            <Label className="form-label">Your bid</Label>
                                            <br />
                                            <div className="input-group mb-1">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text">$</span>
                                                </div>
                                                <Input type="text" name="maxPrice" id="maxPrice" />
                                            </div>
                                            <p className="text-muted text-sm">Enter <span className="text-primary">${formatPrice(bids.minToPlace)}</span> or more to bid.</p>
                                        </FormGroup>
                                        <FormGroup>
                                            <Button onClick={submitBid} color="primary" block>{winning ? 'Increase' : 'Place'} your bid</Button>
                                        </FormGroup>
                                    </Form>
                                    <p className="text-muted text-sm text-center">Bidding means you're committing to buy this item if you're the winning bidder.</p>
                                    <hr className="my-4" />
                                    <div className="text-center">
                                        <p>
                                            {activity.watching
                                                ? <a href="#" className="text-secondary"><i className="fas fa-heart" /> &nbsp;Unwatch this auction</a>
                                                : <a href="#" className="text-secondary"><i className="far fa-heart" /> &nbsp;Watch this auction</a>
                                            }
                                        </p>
                                        <p className="text-muted text-sm"><span className="text-secondary">{activity.watchCount}</span> other people are watching.</p>
                                    </div>
                                </div>
                                :
                                <div
                                    style={{ top: "100px" }}
                                    className="p-4 shadow ml-lg-4 rounded sticky-top">
                                    <p className="text-muted">Ended at {formatDate(auction.endAt)}</p>
                                    <Badge color="danger-light" className="ml-1">Ended</Badge>
                                    &nbsp;
                                    <span className="text-danger h2">
                                        ${formatPrice(bids.highest?.price ?? auction.startPrice)}
                                    </span>
                                </div>
                            }
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    )
}

function submitBid() {
    // TODO: Some client-side validation
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            auctionId: document.getElementById('auctionId').value,
            maxPrice: parseFloat(document.getElementById('maxPrice').value) * 100
        })
    }

    fetch('/api/bids', requestOptions)
        .then(response => response.json())
        .then(data => window.location.reload())
    // TODO reflect changes in the UI
}

export default ItemDetail