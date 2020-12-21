import React from 'react'
import Link from 'next/link'
import { Container, Row, Col, Button } from 'reactstrap'
import ProgressBar from 'src/components/ProgressBar'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggedUser: true,
            title: "Auction an item"
        },
    }
}

const NewAuction0 = () => {
    return (
        <React.Fragment>
            <ProgressBar progress={0} />
            <section className="py-5 py-lg-7">
                <Container>
                    <Row>
                        <Col lg="5">
                            <p className="subtitle text-primary">
                                Auction an item
                            </p>
                            <h1 className="h2 mb-5">
                                Let's get started
                            </h1>
                            <p>The following steps will guide you through the process of listing
                                your item for auction via Contrib.</p>
                            <p> You will be prompted to enter details for your item, upload photos 
                                and videos as well as select the starting price,
                                charity and how long the auction runs for.</p>
                            <p className="mb-5 mb-lg-0">
                                <Link href="new/step-1" passHref>
                                    <Button color="primary">
                                        Start
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
        </React.Fragment>
    )
}

export default NewAuction0