import React from 'react'
import Link from 'next/link'
import {
    Container,
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap'
import data from '../data/text.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "Text"
        },
    }
}

export default () => {
    return (
        <React.Fragment>
            <section className="hero py-6 py-lg-7 text-white dark-overlay">
                {data.hero && <img src={`/content/img/photo/${data.hero}`} className="bg-image" alt="" />}
                <Container className="overlay-content">
                    <Breadcrumb listClassName="text-white justify-content-center no-border mb-0">
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

                </Container>
            </section>
            <section className="py-6">
                <Container>
                    <Row>
                        <Col xl="8" lg="10" className="mx-auto" >
                            <p className="lead mb-5" dangerouslySetInnerHTML={{ __html: data.excerpt }} />
                        </Col>
                    </Row>
                    {data.img &&
                        <Row>
                            <Col xl="10" className="mx-auto">
                                <img src={`/content/img/photo/${data.img}`} alt="" className="img-fluid mb-5" />
                            </Col>
                        </Row>
                    }
                    {data.content &&
                        <Row>
                            <Col xl="8" lg="10" className="mx-auto">
                                <div className="text-content" dangerouslySetInnerHTML={{ __html: data.content }} />
                            </Col>
                        </Row>
                    }
                </Container>
            </section>
        </React.Fragment>
    )
}