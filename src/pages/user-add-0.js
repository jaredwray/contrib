import React from 'react'

import Link from 'next/link'

import { Container, Row, Col, Button } from 'reactstrap'

import ProgressBar from '../components/ProgressBar'

import data from '../data/user-add.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggedUser: true,
            title: "Add your listing"
        },
    }
}

export default () => {
    return (
        <React.Fragment>
            <ProgressBar progress={0} />
            <section className="py-5 py-lg-7">
                <Container>
                    <Row>
                        <Col lg="5">
                            <p className="subtitle text-primary">
                                {data[0].subtitle}
                            </p>
                            <h1 className="h2 mb-5">
                                {data[0].title}
                            </h1>
                            <div dangerouslySetInnerHTML={{
                                __html: data[0].content
                            }} />
                            <p className="mb-5 mb-lg-0">
                                <Link href="user-add-1" passHref>
                                    <Button color="primary">
                                        {data[0].button}
                                    </Button>
                                </Link>
                            </p>
                        </Col>
                        <Col lg="5" className="ml-auto d-flex align-items-center">
                            <img src="/content/img/illustration/undraw_celebration_0jvk.svg" alt="" style={{ width: "400px" }}
                                className="img-fluid" />
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment >
    )
}