import React from 'react'
import Link from 'next/link'
import { Badge, Card, CardBody, CardTitle, CardSubtitle, CardText } from 'reactstrap'
import { AuctionStatus, getAuctionStatus } from 'models/database/auction'
import { formatPrice } from 'services/formatting'

const CardAuction = props => {
    const auction = props.data
    const auctionStatus = getAuctionStatus(auction)    
    return (
        <Card className="h-100 border-0 shadow" style={{ opacity: auctionStatus == AuctionStatus.Active ? 1 : 0.5 }}>
            <div className="card-img-top overflow-hidden gradient-overlay">
                <img src={auction.photos[0].url} alt={auction.title} className="img-fluid" />
                <Link href={`/item/${auction._id}`}>
                    <a className="tile-link" />
                </Link>
                {auctionStatus !== AuctionStatus.Ended &&
                <div className="card-img-overlay-top text-right">
                    <a className="card-fav-icon position-relative z-index-40" href="#">
                        <svg className="svg-icon text-white">
                            <use xlinkHref="/content/svg/orion-svg-sprite.svg#heart-1" />
                        </svg>
                    </a>
                </div>
                }
            </div>
            <CardBody className="d-flex align-items-center">
                <div className="w-100">
                    <CardTitle tag="h6">
                        <Link href={`/item/${auction._id}`}>
                            <a className="text-decoration-none text-dark text-truncate">
                                {auction.title}
                            </a>
                        </Link>
                    </CardTitle>
                    <CardSubtitle className="d-flex mb-3">
                        <p className="flex-grow-1 mb-0 text-muted text-uppercase text-sm">
                            {auction.seller.name}
                        </p>
                    </CardSubtitle>
                    <CardText className="text-muted text-right">
                        {auctionStatus === AuctionStatus.Ended &&
                            <Badge color="danger-light" className="ml-1">Ended</Badge>
                        }
                        &nbsp;
                        <span className={`h4 ${auctionStatus !== AuctionStatus.Ended ? 'text-primary' : 'text-danger'}`}>
                            ${formatPrice(auction.startPrice)}
                        </span>
                    </CardText>
                </div>
            </CardBody>
        </Card>
    )
}

export default CardAuction