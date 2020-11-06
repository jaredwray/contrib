import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import UseWindowSize from '../hooks/UseWindowSize'

import { Container, Row, Col, Media, Button, Collapse, Breadcrumb, BreadcrumbItem } from 'reactstrap'

import data from '../data/user-booking-detail.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggedUser: true,
            title: "Booking detail"
        },
    }
}

import Swiper from '../components/Swiper'

const UserBookingDetail = () => {
    const Map = dynamic(
        () => import('../components/Map'),
        { ssr: false }
    )

    const [rulesCollapse, setRulesCollapse] = React.useState(false)
    const [dragging, setDragging] = React.useState(false)
    const [tap, setTap] = React.useState(false)

    const size = UseWindowSize()

    React.useEffect(() => {
        setTap(size.width > 700 ? true : false)
        setDragging(size.width > 700 ? true : false)
    }, [])

    const splitRulesBy = (n, data) => {
        let result = [];
        result.push(data.slice(0, n));
        result.push(data.slice(n, data.length));
        return result;
    }

    const splitedRules = splitRulesBy(4, data.rules)
    return (
        <Container fluid>
            <Row>
                <Col
                    lg="7"
                    xl="5"
                    className="px-4 pb-4 pl-xl-5 pr-xl-5"
                >
                    <section className="mx-n4 mx-xl-n5 mb-4 mb-xl-5">
                        <Swiper
                            className="booking-detail-slider"
                            perView={2}
                            spaceBetween={0}
                            loop={true}
                            centeredSlides={true}
                            data={data.swiper}
                            gallery={true}
                            paginationClass="swiper-pagination-white"
                            navigation={true}
                        />

                    </section>
                    <Breadcrumb listClassName="pl-0  justify-content-start">
                        <BreadcrumbItem>
                            <Link href="/">
                                <a>Home</a>
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Link href="/user-grid">
                                <a>Your trips</a>
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Trip to London
                        </BreadcrumbItem>
                    </Breadcrumb>

                    <div className="text-block">
                        <p className="subtitle">
                            {data.date}
                        </p>
                        <h1 className="hero-heading mb-3">
                            {data.title}
                        </h1>
                    </div>
                    <div className="text-block">
                        <h6 className="mb-4">{data.stay.title}</h6>
                        <Row className="mb-3">
                            <Col
                                md="6"
                                className="d-flex align-items-center mb-3 mb-md-0"
                            >
                                <div className="date-tile mr-3">
                                    <div className="text-uppercase">
                                        <span className="text-sm">
                                            {data.stay.from.month.substring(0, 3)}
                                        </span>
                                        <br />
                                        <strong className="text-lg">
                                            {data.stay.from.day}
                                        </strong>
                                    </div>
                                </div>
                                <p className="text-sm mb-0">
                                    {data.stay.checkin.title}
                                    <br />
                                    {data.stay.checkin.content}
                                </p>
                            </Col>
                            <Col
                                md="6"
                                className="d-flex align-items-center"
                            >
                                <div className="date-tile mr-3">
                                    <div className="text-uppercase">
                                        <span className="text-sm">
                                            {data.stay.to.month.substring(0, 3)}
                                        </span>
                                        <br />
                                        <strong className="text-lg">
                                            {data.stay.to.day}
                                        </strong>
                                    </div>
                                </div>
                                <p className="text-sm mb-0">
                                    {data.stay.checkout.title}
                                    <br />
                                    {data.stay.checkout.content}
                                </p>
                            </Col>
                        </Row>

                    </div>
                    <div className="text-block">
                        <Row>
                            <Col xs="sm">
                                <h6>Address</h6>
                                <p className="text-muted">
                                    {data.address}
                                </p>
                            </Col>

                            <Col xs="sm">
                                <h6>Phone</h6>
                                <p className="text-muted">
                                    {data.phone}
                                </p>
                            </Col>
                        </Row>
                    </div>
                    <div className="text-block">
                        <Media className="align-items-center mb-3">
                            <Media body>
                                <h6>{data.type}</h6>
                                <p className="text-muted mb-0">
                                    Hosted by
                                    <Link href="/user-profile">
                                        <a className="text-reset">
                                            {data.owner.name}
                                        </a>
                                    </Link>
                                </p>
                            </Media>
                            <Link href="/user-profile">
                                <a>
                                    <img
                                        src={`/content/img/avatar/${data.owner.avatar}`}
                                        alt={data.owner.name} className="avatar avatar-lg avatar-border-white ml-4"
                                    />
                                </a>
                            </Link>
                        </Media>
                    </div>
                    <div className="text-block">
                        <h6 className="mb-3">
                            Who's coming
                            </h6>
                        <Row className="mb-3">
                            {data.members.map((member, index) =>
                                <Col key={index}
                                    xs="auto"
                                    className="text-center text-sm">
                                    <img src={`/content/img/avatar/${member.avatar}`} alt={member.name} className="avatar avatar-border-white mb-1" />
                                    <br />
                                    {member.name}
                                </Col>
                            )}
                        </Row>

                    </div>
                    <div className="text-block">
                        <Row>
                            <Col>
                                <h6> Total cost</h6>
                                <p className="text-muted">{data.cost}</p>
                            </Col>
                            <Col className="col align-self-center">
                                <p className="text-right d-print-none">
                                    <Button
                                        color="link"
                                        href="#"
                                        className="text-muted"
                                    >
                                        <i className="far fa-file mr-2" />Your invoice
                                    </Button>
                                </p>
                            </Col>
                        </Row>
                    </div>
                    <div className="text-block">
                        <h6 className="mb-4">
                            Things to keep in mind
                        </h6>

                        <ul className="list-unstyled">
                            {splitedRules[0].map((item, index) =>
                                <li className="mb-2" key={index}>
                                    <Media className="align-items-center mb-3">
                                        <div className="icon-rounded icon-rounded-sm bg-secondary-light mr-4">
                                            <i className={`fa fas fa-${item.icon} text-secondary fa-fw text-center`} />
                                        </div>
                                        <Media body>
                                            <span className="text-sm">
                                                {item.content}
                                            </span>
                                        </Media>
                                    </Media>
                                </li>
                            )}
                        </ul>
                        {splitedRules[1] &&
                            <React.Fragment>
                                <Collapse isOpen={rulesCollapse}>
                                    <ul className="list-unstyled">
                                        {splitedRules[1].map((item, index) =>
                                            <li className="mb-2" key={index}>
                                                <Media className="align-items-center mb-3">
                                                    <div className="icon-rounded icon-rounded-sm bg-secondary-light mr-4">
                                                        <i className={`fa fas fa-${item.icon} text-secondary fa-fw text-center`} />
                                                    </div>
                                                    <Media body>
                                                        <span className="text-sm">
                                                            {item.content}
                                                        </span>
                                                    </Media>
                                                </Media>
                                            </li>
                                        )}
                                    </ul>
                                </Collapse>
                                <Button
                                    color="link"
                                    aria-expanded={rulesCollapse}
                                    onClick={() => setRulesCollapse(!rulesCollapse)}
                                    className="btn-collapse pl-0 text-muted"
                                >
                                    {rulesCollapse ? "Show less" : "Show more"}
                                </Button>
                            </React.Fragment>
                        }

                    </div>


                    <div className="text-block d-print-none">
                        <Button
                            color="link"
                            onClick={() => window.print()}
                            className="pl-0"
                        >
                            <i className="fa fa-print mr-2" />
                            Print
                        </Button>
                    </div>
                </Col>
                <Col
                    lg="5"
                    xl="7"
                    className="map-side-lg px-lg-0"
                >
                    <Map
                        className="map-full shadow-left"
                        center={[40.732346, -74.0014247]}
                        markerPosition={[40.732346, -74.0014247]}
                        zoom={18}
                        scrollWheelZoom={false}
                        dragging={dragging}
                        tap={tap}
                        geoJSON={false}
                    />
                </Col>
            </Row>
        </Container>
    )
};

export default UserBookingDetail;