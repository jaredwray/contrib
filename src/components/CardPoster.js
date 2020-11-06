import React from 'react'
import Link from 'next/link'

import {
    Card,
    CardBody,
    CardTitle,
    CardText
} from 'reactstrap'

const CardPoster = props => {
    const data = props.data
    return (
        <Card className="card-poster gradient-overlay hover-animate mb-4 mb-lg-0">
            <Link href={data.link}>
                <a className="tile-link" />
            </Link>
            <img src={`/content/${data.img}`} alt="Card image" className="bg-image" />
            <CardBody className="card-body overlay-content">
                <CardTitle tag="h6" className="card-title text-shadow text-uppercase">
                    {data.title}
                </CardTitle>
                <CardText className="card-text text-sm">
                    {data.subtitle}
                </CardText>
            </CardBody>
        </Card>
    )
};

export default CardPoster;