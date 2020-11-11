import React from 'react'
import Link from 'next/link'
import { Container, Button } from 'reactstrap'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "404 Not Found"
        },
    }
}

const Error404 = () => {
    return (
        <React.Fragment>
            <div className="mh-full-screen d-flex align-items-center dark-overlay">
                <img src="/content/img/photo/aron-visuals-3jBU9TbKW7o-unsplash.jpg" alt="Not found" className="bg-image" />
                <Container className="text-white text-lg overlay-content py-6 py-lg-0">
                    <h1 className="display-3 font-weight-bold mb-5">Oops, we couldn't find that.</h1>
                    <p className="font-weight-light mb-5">Sorry we're still building out the site right now. It's possible there should have been something here.</p>
                    <p className="font-weight-light mb-5">Then again, maybe not.</p>
                    <p className="mb-6">
                        <Link href="/">
                            <Button href="index" color="outline-light">
                                <i className="fa fa-home mr-2" />Head Home
                            </Button>
                        </Link></p>
                    <p className="h4 text-shadow">404 Not Found</p>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Error404;