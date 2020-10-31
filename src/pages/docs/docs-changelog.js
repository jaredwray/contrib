import React from 'react'
import Link from 'next/link'

import {
    Container,
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
    Badge,
    Card,
    CardBody,
    CardText
} from 'reactstrap'

import DocsNav from '../../components/Docs/DocsNav'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "Docs Changelog"
        },
    }
}

export default () => {
    return (
        <React.Fragment>
            <section className="hero py-5 py-lg-7">
                <Container className="position-relative">
                    <Breadcrumb listClassName="justify-content-center pl-0">
                        <BreadcrumbItem>
                            <Link href="/">
                                <a>Home</a>
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Link href="/docs/docs-introduction">
                                <a>Documentation</a>
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Changelog
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <h1 className="hero-heading">Changelog</h1>
                </Container>
            </section>
            <section className="py-6">
                <Container fluid>
                    <Row className="px-xl-5">
                        <Col lg="2">
                            <DocsNav />
                        </Col>
                        <Col
                            lg="10"
                            xl="8"
                            className="docs-content"
                        >
                            <div id="version1.4.2" className="docs-item">
                                <h5 className="text-uppercase mb-4">Version 1.0.0</h5>
                                <div className="docs-desc"><p className="text-muted">June 30, 2020</p></div>
                                <div className="mt-5">
                                    <Card className="bg-gray-100 border-0">
                                        <CardBody className="py-4">
                                            Initial Release
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    )
}