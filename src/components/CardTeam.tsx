import React from 'react'
import Link from 'next/link'
import { Card, CardBody, CardTitle, CardSubtitle, CardImg } from 'reactstrap'

const CardTeam = props => {
    const data = props.data
    return (
        <Card className="border-0 hover-animate bg-transparent">
            <Link href={data.link}>
                <React.Fragment>
                    <CardImg top src={`/content/img/avatar/${data.img}`} alt={data.title} className="team-img" />
                    <div className="team-circle false" />
                </React.Fragment>
            </Link>
            <CardBody className="team-body text-center">
                <CardTitle tag="h6">
                    {data.title}
                </CardTitle>
                <CardSubtitle tag="p" className="text-muted text-xs text-uppercase">
                    {data.content}
                </CardSubtitle>
            </CardBody>
        </Card>
    )
}

export default CardTeam