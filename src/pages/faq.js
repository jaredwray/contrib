import React from 'react'
import Link from 'next/link'
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import data from 'data/faq.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "Faq"
        },
    }
}

const Faq = () => {
    const groupByN = (n, data) => {
        let result = [];
        for (let i = 0; i < data.length; i += n) result.push(data.slice(i, i + n));
        return result;
    }
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
                    <h1 className="hero-heading mb-5">{data.title && data.title}</h1>
                    {data.content &&
                        <Row>
                            <Col
                                xl="8"
                                className="mx-auto"
                            >
                                <p className="lead mb-0">
                                    {data.content}
                                </p>
                            </Col>
                        </Row>
                    }

                </Container>
            </section>
            <section className="py-6">
                <Container>
                    {data.questionGroups && data.questionGroups.map(group => {
                        const groupedQuestions = group.questions && groupByN(2, group.questions)
                        return (
                            <div key={group.title} className="py-4">
                                <h2 className="mb-5 text-primary">{group.title}</h2>
                                <Row>
                                    {groupedQuestions.map(questions =>
                                        <Col md="6" key={questions[0].title}>
                                            {questions.map(question =>
                                                <React.Fragment key={question.title}>
                                                    <h5>{question.title}</h5>
                                                    <p className="text-muted mb-4">
                                                        {question.content}
                                                    </p>
                                                </React.Fragment>
                                            )}
                                        </Col>
                                    )}
                                </Row>
                            </div>
                        )
                    }
                    )}
                </Container>
            </section>
        </React.Fragment>
    )
}

export default Faq