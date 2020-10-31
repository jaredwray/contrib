import React from 'react'

import Link from 'next/link'

import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Button,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap'

import data from '../data/pricing.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "Pricing"
        },
    }
}

export default () => {

    return (
        <React.Fragment>
            <section className="hero py-5 py-lg-7">
                <Container className="position-relative">
                    <Breadcrumb listClassName="pl-0  justify-content-center">
                        <BreadcrumbItem>
                            <Link href="/">
                                <a>Home</a>
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            {data.subtitle}
                        </BreadcrumbItem>
                    </Breadcrumb>

                    <h1 className="hero-heading">{data.title && data.title}</h1>
                    <Row>
                        <Col
                            xl="8"
                            className="mx-auto"
                        >
                            <p className="text-lg text-muted mb-5">{data.content && data.content}</p>
                            <p className="mb-0">
                                <Button
                                    href="#"
                                    color="primary"
                                    className="mr-4">
                                    Get started
                                </Button>
                                <Button
                                    href="#"
                                    color="outline-primary">
                                    Contact sales
                                </Button>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="py-6">
                <Container>
                    <Row>
                        {data.columns && data.columns.map((column, index) =>
                            <Col key={column.title} lg="4">
                                <Card className={`mb-5 mb-lg-0 border-0 ${index === 1 ? 'card-highlight shadow-lg' : 'shadow'}`}>
                                    {index === 1 &&
                                        <div className="card-status bg-primary" />
                                    }
                                    <CardBody>
                                        <h2 className="text-base subtitle text-center text-primary py-3">
                                            {column.title}
                                        </h2>
                                        <p className="text-muted text-center">
                                            <span className="h1 text-dark">
                                                {column.price}
                                            </span>
                                            <span className="ml-2">
                                                / month
                                        </span>
                                        </p>
                                        <hr />
                                        <ul className="fa-ul my-4">
                                            {column.items.map(item =>
                                                <li
                                                    key={item.title}
                                                    className={`mb-3 ${item.status ? '' : 'text-muted'}`}
                                                >
                                                    {item.status ?
                                                        <span className="fa-li text-primary">
                                                            <i className="fas fa-check" />
                                                        </span>
                                                        :
                                                        <span className="fa-li">
                                                            <i className="fas fa-times" />
                                                        </span>
                                                    }
                                                    {item.title}
                                                </li>
                                            )}
                                        </ul>
                                        <div className="text-center">
                                            <Button
                                                href="#"
                                                color="outline-primary"
                                            >
                                                Select
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    )
}