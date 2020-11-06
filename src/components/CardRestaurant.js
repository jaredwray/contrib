import React from 'react'
import Link from 'next/link'

import {
    Card,
    CardBody,
    Badge
} from 'reactstrap'

import Stars from '../components/Stars'

const CardRestaurant = props => {
    const data = props.data
    return (
        <Card className="h-100 border-0 shadow">
            <div
                style={{
                    backgroundImage: `url(/content/img/photo/${data.image})`,
                    minHeight: "200px"
                }}
                className="card-img-top overflow-hidden dark-overlay bg-cover"
            >
                <Link href={data.link}>
                    <a className="tile-link" />
                </Link>
                <div className="card-img-overlay-bottom z-index-20">
                    <h4 className="text-white text-shadow">
                        {data.name}
                    </h4>
                    <p className="mb-2 text-xs">
                        <Stars stars={data.stars} />
                    </p>
                </div>
                <div className="card-img-overlay-top d-flex justify-content-between align-items-center">
                    <Badge pill color="transparent" className="px-3 py-2">
                        {data.category}
                    </Badge>
                    <a href="#" className="card-fav-icon position-relative z-index-40">
                        <svg className="svg-icon text-white">
                            <use xlinkHref="/content/svg/orion-svg-sprite.svg#heart-1" />
                        </svg>
                    </a>
                </div>
            </div>
            <CardBody>
                <p className="text-sm text-muted mb-3">
                    {data.about.substring(0, 115) + '...'}
                </p>
                <p className="text-sm text-muted text-uppercase mb-1">
                    By
                    <Link href="user-profile">
                        <a className="text-dark ml-1">
                            {data.person}
                        </a>
                    </Link>
                </p>
                <p className="text-sm mb-0">
                    {data.tags.map((tag, index) =>
                        <a key={index} className="mr-1" href="#">
                            {tag}
                            {index < data.tags.length - 1 && ','}
                        </a>
                    )}
                </p>
            </CardBody>
        </Card>
    )
};

export default CardRestaurant;