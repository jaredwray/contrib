import React from 'react'
import Link from 'next/link'

import {
    Media
} from 'reactstrap'

import Stars from './Stars'

export default props => {
    const data = props.data
    return (
        <Media className="d-block d-sm-flex review">
            <div className="text-md-center mr-4 mr-xl-5">
                <img src={`/content/img/avatar/${data.avatar}`} alt={data.title} className="d-block avatar avatar-xl p-2 mb-2" />
                <span className="text-uppercase text-muted text-sm">
                    {data.date}
                </span>
            </div>
            <Media body>
                <h6 className="mt-2 mb-1">{data.title}</h6>
                <div className="mb-2">
                    <Stars size="xs" color="text-primary" stars={data.stars} />
                </div>
                <p className="text-muted text-sm">{data.content}</p>
            </Media>
        </Media>
    )
}