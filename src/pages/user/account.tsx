import React from 'react'
import Link from 'next/link'
import { Container, Row, Col, Card, CardBody, CardText, CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import data from 'src/data/user-account.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "Your account"
        },
    }
}

const UserAccount = () => {
    return (
        <section className="py-5">
            <Container>
                <Breadcrumb listClassName="pl-0  justify-content-start">
                    <BreadcrumbItem>
                        <Link href="/">
                            <a>Home</a>
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        Account
                    </BreadcrumbItem>
                </Breadcrumb>

                <h1 className="hero-heading mb-0">{data.title}</h1>
                <p className="text-muted mb-5">{data.subtitle}</p>
                <Row>
                    {data.cards.map(card =>
                        <Col
                            xs="6"
                            md="4"
                            className="mb-30px"
                            key={card.title}
                        >
                            <Card className="h-100 border-0 shadow hover-animate">
                                <CardBody>
                                    <div className="icon-rounded bg-secondary-light mb-3">
                                        <svg className="svg-icon text-secondary w-2rem h-2rem">
                                            <use xlinkHref={`/content/svg/orion-svg-sprite.svg#${card.icon}`} />
                                        </svg>
                                    </div>
                                    <CardTitle className="mb-3" tag="h5">
                                        <Link href={card.link}>
                                            <a className="text-decoration-none text-dark stretched-link">
                                                {card.title}
                                            </a>
                                        </Link>
                                    </CardTitle>
                                    <CardText className="text-muted text-sm">
                                        {card.content}
                                    </CardText>
                                </CardBody>
                            </Card>
                        </Col>
                    )}
                </Row>
            </Container>
        </section>
    )
}

export default UserAccount