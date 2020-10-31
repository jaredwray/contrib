import React from 'react'

import Link from 'next/link'

import {
    Container,
    Button
} from 'reactstrap'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "404"
        },
    }
}

export default () => {
    return (
        <React.Fragment>
            <div className="mh-full-screen d-flex align-items-center dark-overlay">
                <img src="/content/img/photo/aron-visuals-3jBU9TbKW7o-unsplash.jpg" alt="Not found" className="bg-image" />
                <Container className="text-white text-lg overlay-content py-6 py-lg-0">
                    <h1 className="display-3 font-weight-bold mb-5">Oops, that page is not here.</h1>
                    <p className="font-weight-light mb-5">Elit adipisicing aliquip irure non consequat quis ex fugiat dolor in irure pariatur eu aute. Ea tempor nisi sit in Lorem exercitation mollit ut veniam in do eu excepteur. </p>
                    <p className="mb-6">
                        <Link href="index">
                            <Button href="index" color="outline-light">
                                <i className="fa fa-home mr-2" />Start from the Homepage
                            </Button>
                        </Link></p>
                    <p className="h4 text-shadow">Error 404</p>
                </Container>
            </div>
        </React.Fragment>
    )
}