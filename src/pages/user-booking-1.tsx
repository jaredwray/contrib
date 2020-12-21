import React from 'react'
import Link from 'next/link'
import { Container, Row, Col, Button, Alert, Media, } from 'reactstrap'
import ProgressBar from 'src/components/ProgressBar'
import data from 'src/data/user-booking.json'
import BookingForm from 'src/components/BookingForm'
import BookingColumn from 'src/components/BookingColumn'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "User booking",
            bookingForm: true
        },
    }
}

const UserBooking1 = () => {
    return (
        <React.Fragment>
            <ProgressBar progress={25} />
            <section className="py-5">
                <Container>
                    <Row>
                        <Col lg="7">
                            <p className="subtitle text-primary">
                                {data.steps[0].subtitle}
                            </p>
                            <h1 className="h2 mb-5">
                                {data.steps[0].title}
                                <span className="text-muted float-right">
                                    Step 1
                                </span>
                            </h1>
                            <div className="text-block">
                                <Alert color="warning" className="text-sm mb-3">
                                    <Media className="align-items-center">
                                        <svg className="svg-icon svg-icon svg-icon-light w-2rem h-2rem mr-3 text-reset">
                                            <use xlinkHref="/content/svg/orion-svg-sprite.svg#heart-1" />
                                        </svg>
                                        <Media
                                            dangerouslySetInnerHTML={{ __html: data.steps[0].badge }}
                                            body
                                        />

                                    </Media>
                                </Alert>
                            </div>
                            <BookingForm
                                data={data.steps[0].formBlocks}
                                from={data.from}
                                to={data.to}
                            />
                            <Row className="form-block flex-column flex-sm-row">
                                <Col className="text-center text-sm-left" />
                                <Col className="text-center text-sm-right">
                                    <Link href="/user-booking-2" passHref>
                                        <Button
                                            color="primary"
                                            className="px-3"
                                        >
                                            Next step<i className="fa-chevron-right fa ml-2" />
                                        </Button>
                                    </Link>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="5" className="pl-xl-5">
                            <BookingColumn
                                from={data.from}
                                to={data.to}
                            />
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment >
    )
}

export default UserBooking1