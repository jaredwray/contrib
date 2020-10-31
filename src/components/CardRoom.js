import React from 'react'
import Link from 'next/link'

import {
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardText,
    Media
} from 'reactstrap'


import Stars from './Stars'

export default props => {
    const data = props.data
    return (
        <Card className="h-100 border-0 shadow">
            <div className="card-img-top overflow-hidden gradient-overlay">
                <img src={`/content/img/photo/${data.image}`} alt={data.name} className="img-fluid" />
                <Link href="detail-rooms">
                    <a className="tile-link" />
                </Link>
                <div className="card-img-overlay-bottom z-index-20">
                    <Media className="text-white text-sm align-items-center">
                        <img src={`/content/${data.avatar}`} alt={data.person} className="avatar avatar-border-white mr-2" />
                        <Media body>
                            {data.person}
                        </Media>
                    </Media>

                </div>
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
                        <Link href="detail-rooms">
                            <a className="text-decoration-none text-dark">
                                {data.name}
                            </a>
                        </Link>
                    </CardTitle>
                    <CardSubtitle className="d-flex mb-3">
                        <p className="flex-grow-1 mb-0 text-muted text-sm">
                            {data.subtitle}
                        </p>
                        <p className="flex-shrink-1 mb-0 card-stars text-xs text-right">
                            <Stars stars={data.stars} />
                        </p>
                    </CardSubtitle>
                    <CardText className="text-muted">
                        <span className="h4 text-primary">
                            ${data.price}
                        </span>
                        &nbsp;per night
                    </CardText>
                </div>
            </CardBody>
        </Card>
    )
}