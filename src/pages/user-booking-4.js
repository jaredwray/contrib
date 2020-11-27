import React from 'react'
import Link from 'next/link'
import { Container, Button, Row, Col } from 'reactstrap'
import { BookingContext } from 'components/BookingContext'
import ProgressBar from 'components/ProgressBar'
import data from 'data/user-booking.json'
import BookingColumn from 'components/BookingColumn'

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

const UserBooking4 = () => {
    const [bookingInputs, setBookingInputs] = React.useContext(BookingContext)

    return (
        <React.Fragment>
            <ProgressBar progress={100} />
            <section className="py-5">
                <Container>
                    <Row>
                        <Col lg="7">
                            <p className="subtitle text-primary">
                                {data.steps[3].subtitle}
                            </p>
                            <h1 className="h2 mb-5">
                                {data.steps[3].title}
                                <span className="text-muted float-right">Step 4</span>
                            </h1>
                            <div className="text-block">
                                <p className="text-muted">
                                    {data.steps[3].content}
                                </p>
                                <p className="text-muted mb-5">
                                    {data.steps[3].content2}
                                </p>
                                <p className="text-center mb-5">
                                    <Link href={data.steps[3].buttons[0].link} passHref>
                                        <Button color="primary" className="mx-2 mb-2">
                                            <i className="far fa-file mr-2" />
                                            {data.steps[3].buttons[0].title}
                                        </Button>
                                    </Link>
                                    <Link href={data.steps[3].buttons[1].link} passHref>
                                        <Button color="outline-muted" className="mb-2">
                                            {data.steps[3].buttons[1].title}
                                        </Button>
                                    </Link>
                                </p>
                                <p className="mb-5 text-center">
                                    <img src="/content/img/illustration/undraw_celebration_0jvk.svg" alt="" style={{ width: "400px" }} className="img-fluid" />
                                </p>
                            </div>
                        </Col>
                        <Col
                            lg="5"
                            className="pl-xl-5"
                        >
                            <BookingColumn
                                from={data.from}
                                to={data.to}
                            />
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    )
}

export default UserBooking4