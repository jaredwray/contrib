import React from 'react'

import Link from 'next/link'

import { Container, Button, ListGroup, ListGroupItem, Row, Col, Badge, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import Select from 'react-select'

import data from '../data/user-list.json'

import Pagination from '../components/Pagination'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggedUser: true,
            title: "Booking - list view"
        },
    }
}

const UserList = () => {
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
                        Host view
                    </BreadcrumbItem>
                </Breadcrumb>

                <div className="d-flex justify-content-between align-items-end mb-5">
                    <h1 className="hero-heading mb-0">{data.title}</h1>
                    <Button
                        href={data.button.link}
                        color="link"
                        className="text-muted"
                    >
                        {data.button.title}
                    </Button>
                </div>
                <div className="d-flex justify-content-between align-items-center flex-column flex-lg-row mb-5">
                    <div className="mr-3">
                        <p className="mb-3 mb-lg-0">
                            You have <strong>12 bookings</strong> in your property
                        </p>
                    </div>
                    <div className="text-center">
                        <label className="form-label mr-2">Sort by</label>
                        <Select
                            id="reactselect"
                            options={data.sortby}
                            defaultValue={data.sortby[0]}

                            className="dropdown bootstrap-select mr-3 mb-3 mb-lg-0"
                            classNamePrefix="selectpicker"
                        />
                        <Button
                            href={data.download.link}
                            color="outline-secondary"
                        >
                            <i className="fa fa-download mr-2" />{data.download.title}
                        </Button>
                    </div>
                </div>
                <ListGroup className="shadow mb-5">
                    {data.bookings.map((booking, index) =>
                        <Link href={booking.link} passHref key={index}>
                            <ListGroupItem action className="p4" tag="a">
                                <Row>
                                    <Col lg="4" className="align-self-center mb-4 mb-lg-0">
                                        <div className="d-flex align-items-center mb-3">
                                            <h2 className="h5 mb-0">
                                                {booking.title}
                                            </h2>
                                            <img
                                                src={`/content/img/avatar/${booking.avatar}`}
                                                alt={booking.title}
                                                className="avatar avatar-sm avatar-border-white ml-3"
                                            />
                                        </div>
                                        <p className="text-sm text-muted">
                                            {booking.type}
                                        </p>
                                        <Badge color={booking.badgecolor ? booking.badgecolor : "secondary-light"} className="p-2" pill>
                                            {booking.date}
                                        </Badge>
                                    </Col>
                                    <Col lg="8">
                                        <Row>
                                            <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                                                <h6 className="label-heading">
                                                    Rate type
                                                </h6>
                                                <p className="text-sm font-weight-bold">
                                                    {booking.rate}
                                                </p>
                                                <h6 className="label-heading">
                                                    Nights
                                                </h6>
                                                <p className="text-sm font-weight-bold mb-0">
                                                    {booking.nights}
                                                </p>
                                            </Col>
                                            <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                                                <h6 className="label-heading">
                                                    Occupancy
                                                </h6>
                                                <p className="text-sm font-weight-bold">
                                                    {booking.occupancy}
                                                </p>
                                                <h6 className="label-heading">
                                                    Charge
                                                </h6>
                                                <p className="text-sm font-weight-bold mb-0">
                                                    {booking.charge}
                                                </p>
                                            </Col>
                                            <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                                                <h6 className="label-heading">
                                                    Booked Date
                                                </h6>
                                                <p className="text-sm font-weight-bold">
                                                    {booking.booked}
                                                </p>
                                                <h6 className="label-heading">
                                                    Arrival Time
                                                </h6>
                                                <p className="text-sm font-weight-bold mb-0">
                                                    {booking.arrival}
                                                </p>
                                            </Col>
                                            <Col xs="12" lg="3" className="align-self-center">
                                                <span className={`${booking.paid ? 'text-primary' : 'text-muted'} text-sm text-uppercase`}>
                                                    <i className={`fa ${booking.paid ? 'fa-check' : 'fa-times'} fa-fw mr-2`} />
                                                        Booking paid
                                                </span>
                                                <br className="d-none d-lg-block" />
                                                <span className={`${booking.confirmed ? 'text-primary' : 'text-muted'} text-sm text-uppercase`}>
                                                    <i className={`fa ${booking.confirmed ? 'fa-check' : 'fa-times'} fa-fw mr-2`} />
                                                        Confirmed
                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                        </Link>
                    )}
                </ListGroup>
                <Pagination />
            </Container>
        </section>
    )
};

export default UserList;