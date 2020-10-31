import React from 'react'
import Link from 'next/link'

import {
    Card,
    CardBody
} from 'reactstrap'


export default props => {
    const post = props.data
    return (
        <Card className="border-0 h-100 shadow">
            <Link href="/blog/[slug]" as={`/blog/${post.slug}`}>
                <a>
                    <img src={`/content/${post.img}`} alt="..." className="card-img-top" />
                </a>
            </Link>
            <CardBody>
                <a href="#" className="text-uppercase text-muted text-sm letter-spacing-2">
                    {post.category}
                </a>
                <h5 className="my-2">
                    <Link href="/blog/[slug]" as={`/blog/${post.slug}`}>
                        <a className="text-dark">
                            {post.title}
                        </a>
                    </Link>
                </h5>
                <p className="text-gray-500 text-sm my-3">
                    <i className="far fa-clock mr-2" />
                    {post.date}
                </p>
                <p className="my-2 text-muted text-sm">
                    {post.content}
                </p>
                <Link
                    href="/blog/[slug]"
                    as={`/blog/${post.slug}`}>
                    <a
                        className="pl-0 btn btn-link"
                    >
                        Continue reading <i className="fa fa-long-arrow-alt-right" />
                    </a>
                </Link>
            </CardBody>
        </Card>
    )
}