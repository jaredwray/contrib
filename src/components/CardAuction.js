import React from 'react'
import Link from 'next/link'

import {
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardText,
} from 'reactstrap'

const CardAuction = props => {
    const auction = props.data
    return (
        <Card className="h-100 border-0 shadow">
            <div className="card-img-top overflow-hidden gradient-overlay">
                <img src={auction.photos[0].url} alt={auction.title} className="img-fluid" />
                <Link href={`/item/${auction._id}`}>
                    <a className="tile-link" />
                </Link>
                <div className="card-img-overlay-top text-right">
                    <a className="card-fav-icon position-relative z-index-40" href="#">
                        <svg className="svg-icon text-white">
                            <use xlinkHref="/content/svg/orion-svg-sprite.svg#heart-1" />
                        </svg>
                    </a>
                </div>
            </div>
            <CardBody className="d-flex align-items-center">
                <div className="w-100">
                    <CardTitle tag="h6">
                        <Link href={`/item/${auction._id}`}>
                            <a className="text-decoration-none text-dark">
                                {auction.title}
                            </a>
                        </Link>
                    </CardTitle>
                    <CardSubtitle className="d-flex mb-3">
                        <p className="flex-grow-1 mb-0 text-muted text-uppercase text-sm">
                            {auction.category}
                        </p>
                    </CardSubtitle>
                    <CardText className="text-muted">
                        <span className="h4 text-primary">
                            ${auction.startPrice / 100}
                        </span>
                    </CardText>
                </div>
            </CardBody>
        </Card>
    )
};

export default CardAuction;