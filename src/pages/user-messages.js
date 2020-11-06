import React from 'react'
import Link from 'next/link'

import Select from 'react-select'

import { Container, Row, Col, Button, Label, Breadcrumb, BreadcrumbItem, CustomInput, Badge } from 'reactstrap'

import data from '../data/user-messages.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggedUser: true,
            title: "Personal info - User Messages"
        },
    }
}

const UserInvoice = () => {
    const options = [
        {
            "value": "bulk_0",
            "label": "Edit"
        },
        {
            "value": "bulk_1",
            "label": "Archive"
        },
        {
            "value": "bulk_2",
            "label": "Delete"
        }
    ]
    const sort = [
        {
            "value": "sortBy_0",
            "label": "Newest"
        },
        {
            "value": "sortBy_0",
            "label": "Oldest"
        },
        {
            "value": "sortBy_0",
            "label": "Paid"
        }
    ]

    return (
        <section className="py-5">
            <Container>
                <Breadcrumb listClassName="pl-0 justify-content-start">
                    <BreadcrumbItem>
                        <Link href="/">
                            <a>Home</a>
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <Link href="/user-acccount">
                            <a>Account</a>
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>Messages</BreadcrumbItem>
                </Breadcrumb>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h1 className="hero-heading mb-0">Inbox</h1>
                    <Button color="link" className="text-muted" href="#">Archived Messages</Button>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
                    <Select
                        id="actions"
                        name="actions"
                        options={options}
                        placeholder="Bulk Actions"
                        className="ml-auto ml-md-0 mr-3 mb-3 mb-lg-0 dropdown bootstrap-select z-index-20"
                        classNamePrefix="selectpicker"
                    />

                    <div className="ml-auto ml-md-0">
                        <Label className="form-label mr-2" for="form_sort">Sort by</Label>
                        <Select
                            id="form_sort"
                            name="form_sort"
                            options={sort}
                            defaultValue={sort[0]}
                            className="mr-3 mb-3 mb-lg-0 dropdown bootstrap-select z-index-20"
                            classNamePrefix="selectpicker"
                        />
                    </div>
                </div>
                <div className="list-group shadow mb-5">
                    {data.map((message, index) =>
                        // Map through messages from json file
                        <div key={index} className="list-group-item list-group-item-action p-4">
                            <Row>
                                <Col xs="2" lg="1" className="align-self-lg-center py-3 d-flex align-items-lg-center">
                                    <CustomInput type="checkbox" id={"message-" + index} />
                                    <div className="form-star d-none d-sm-inline-block mt-n1">
                                        <input id={"star_message_" + index} type="checkbox" name="star" />
                                        <label className="star-label" htmlFor={"star_message_" + index}><span className="sr-only">Important Message</span></label>
                                    </div>
                                </Col>
                                <Col xs="9" lg="4" className="align-self-center mb-3 mb-lg-0">
                                    <div className="d-flex align-items-center mb-1 mb-lg-3">
                                        <h2 className="h5 mb-0">{message.name}</h2>
                                        <img className="avatar avatar-sm avatar-border-white ml-3" src={message.image} />
                                    </div>
                                    <p className="text-sm text-muted">{message.type}</p>
                                    <Badge pill color={message.badgecolor} className="p-2">{message.date}</Badge>
                                    <Link href="/user-messages-detail"><a className="stretched-link"></a></Link>
                                </Col>
                                <Col xs="10" lg="7" className="ml-auto">
                                    <Row>
                                        <Col md="8" className="py-3">
                                            <p className="text-sm mb-0">Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.</p>
                                        </Col>
                                        <Col md="4" className="text-right py-3">
                                            <p className="text-sm">{message.date}</p>
                                        </Col>
                                        <Link href="/user-messages-detail"><a className="stretched-link"></a></Link>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    )}

                </div>
            </Container>
        </section>
    )
};

export default UserInvoice