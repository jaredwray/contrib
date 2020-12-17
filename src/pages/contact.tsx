import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Container, Row, Col, Form, FormGroup, Input, Label, Button, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import UseWindowSize from 'hooks/UseWindowSize'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "Contact"
        },
    }
}

let Map

const Contact = () => {
    const [mapLoaded, setMapLoaded] = React.useState(false)
    const [dragging, setDragging] = React.useState(false)
    const [tap, setTap] = React.useState(false)

    const size = UseWindowSize()
    React.useEffect(() => {
        Map = dynamic(
            () => import('components/Map'),
            { ssr: false }
        )
        setMapLoaded(true)
        setTap(size.width > 700 ? true : false)
        setDragging(size.width > 700 ? true : false)
    }, [])

    return (
        <React.Fragment>
            <section className="hero py-6 py-lg-7 text-white dark-overlay">
                <img src="/content/img/photo/seattle-skyline.webp" className="bg-image" alt="A view of the Seattle skyline."/>
                <Container className="overlay-content">
                    <Breadcrumb listClassName="text-white justify-content-center no-border mb-0">
                        <BreadcrumbItem>
                            <Link href="/">
                                <a>Home</a>
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Contact
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <h1 className="hero-heading">How can we help you today?</h1>
                </Container>
            </section>
            <section className="py-6">
                <Container>
                    <Row>
                        <Col
                            md="4"
                            className="text-center text-md-left mb-4 mb-md-0">
                            <div className="icon-rounded mb-4 bg-primary-light">
                                <svg className="svg-icon w-2rem h-2rem text-primary">
                                    <use xlinkHref="content/svg/orion-svg-sprite.svg#map-location-1" />
                                </svg>
                            </div>
                            <h3 className="h5">Address</h3>
                            <p className="text-muted">110 6th Ave. North
                                <br />
                                Seattle
                                <br />
                                WA 98109
                            </p>
                        </Col>
                        <Col
                            md="4"
                            className="text-center text-md-left mb-4 mb-md-0">
                            <div className="icon-rounded mb-4 bg-primary-light">
                                <svg className="svg-icon w-2rem h-2rem text-primary">
                                    <use xlinkHref="content/svg/orion-svg-sprite.svg#mail-1" />
                                </svg>
                            </div>
                            <h3 className="h5">Call center</h3>
                            <p className="text-muted">
                                For technical issues or to talk about becoming a signed athlete or registered charity.
                            </p>
                            <p className="text-muted">
                                <strong>+1 206 441 6041</strong>
                            </p>
                        </Col>
                        <Col
                            md="4"
                            className="text-center text-md-left mb-4 mb-md-0"
                        >
                            <div className="icon-rounded mb-4 bg-primary-light">
                                <svg className="svg-icon w-2rem h-2rem text-primary">
                                    <use xlinkHref="content/svg/orion-svg-sprite.svg#map-location-1" />
                                </svg>
                            </div>
                            <h3 className="h5">Electronic support</h3>
                            <p className="text-muted">
                                Please feel free to write an email to us or to use our electronic ticketing system.
                            </p>
                            <ul className="list-unstyled text-muted">
                                <li><a href="mailto:info@contrib.org"></a>info@contrib.org</li>
                                <li><a href="mailto:support@contrib.org"></a>support@contrib.org</li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="py-6 bg-gray-100">
                <Container>
                    <h2 className="h4 mb-5">Contact form</h2>
                    <Row>
                        <Col
                            md="7"
                            className="mb-5 mb-md-0">
                            <Form>
                                <div className="controls">
                                    <Row>
                                        <Col sm="6">
                                            <FormGroup>
                                                <Label
                                                    for="name"
                                                    className="form-label">
                                                    Your first name *
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    placeholder="Enter your first name"
                                                    required />
                                            </FormGroup>
                                        </Col>
                                        <Col sm="6">
                                            <FormGroup>
                                                <Label
                                                    for="surname"
                                                    className="form-label">
                                                    Your last name *
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="surname"
                                                    id="surname"
                                                    placeholder="Enter your last name"
                                                    required />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <FormGroup>
                                        <Label
                                            for="email"
                                            className="form-label">
                                            Your email address*
                                        </Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="Enter your email"
                                            required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label
                                            for="message"
                                            className="form-label">
                                            Your message for us *
                                        </Label>
                                        <Input
                                            type="textarea"
                                            rows="4"
                                            name="message"
                                            id="message"
                                            placeholder="Enter your message"
                                            required />
                                    </FormGroup>
                                    <Button
                                        type="submit"
                                        color="outline-primary">
                                        Send message
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </section>
            <div className="map-wrapper-450">
                {mapLoaded &&
                    <Map
                        className="h-100"
                        center={[47.6188227, -122.3446415]}
                        markerPosition={[47.6188227, -122.3446415]}
                        zoom={13}
                        dragging={dragging}
                        tap={tap}
                    />
                }
            </div>
        </React.Fragment>
    )
}

export default Contact