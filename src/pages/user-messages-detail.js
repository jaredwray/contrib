import React from 'react'
import Link from 'next/link'


import { Container, Row, Col, Button, Form, Input, Media, Card, CardBody, Breadcrumb, BreadcrumbItem, InputGroupAddon, InputGroup } from 'reactstrap'

import data from '../data/user-messages-detail.json'
import Stars from '../components/Stars'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggedUser: true,
            title: "Personal info - User Messages Detail"
        },
    }
}

const UserInvoice = () => {

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
                        <Link href="/user-messages">
                            <a>Inbox</a>
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>Your messages with Anna</BreadcrumbItem>
                </Breadcrumb>
                <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-4">
                    <h1 className="mb-3 mb-md-0 hero-heading mb-0">Your messages with Anna</h1>
                    <div><Link passHref href="/user-messages"><Button color="link" className="pl-0"><i className="fa fa-arrow-left mr-2" /> Back to all messages</Button></Link></div>
                </div>
                <Card className="border-0 shadow mb-4">
                    <CardBody className="p-4">
                        <div className="text-block pb-3">
                            <Media className="align-items-center">
                                <Media body>
                                    <h6><Link href="/detail-rooms"><a className="text-reset">Modern Apt - Vibrant Neighborhood</a></Link></h6>
                                    <p className="text-muted text-sm mb-0">Entire home in New York</p>
                                    <div className="mt-n1">
                                        <Stars color="text-primary" size="xs" stars="3" />
                                    </div>
                                </Media>
                                <Link href="/detail-rooms"><a><img className="ml-3 rounded" src="/content/img/photo/photo-1512917774080-9991f1c4c750.jpg" alt="" width="100" /></a></Link>
                            </Media>
                        </div>
                        <div className="text-block pt-3 pb-0">
                            <ul className="list-unstyled text-sm mb-0">
                                <li className="mb-3"><i className="fas fa-users fa-fw text-muted mr-2" />3 guests</li>
                                <li className="mb-0"><i className="far fa-calendar fa-fw text-muted mr-2" />Apr 17, 2019 <i className="fas fa-arrow-right fa-fw text-muted mx-3" />Apr 18, 2019</li>
                            </ul>
                        </div>
                    </CardBody>
                </Card>
                <div className="px-4 py-5">
                    <Row>
                        {data.map((message, index) =>
                        // If message has attribute me, message is aligned to right and has different background
                            <Col key={index} md="9" xl="7" className={`media mb-3 ${message.me ? 'ml-auto' : ''}`}>
                                {!message.me && <img className="avatar avatar-border-white" src={message.image} alt="user" /> }
                                <Media body className={message.me ? "mr-3" : "ml-3"}>
                                    <div className={`${message.me ? 'bg-primary' : 'bg-gray-200'} rounded p-4 mb-2`}>
                                        <p className={`${message.me ? 'text-white' : ''} text-sm mb-0`}>{message.content}</p>
                                    </div>
                                    <p className="small text-muted ml-3">{message.date}</p>
                                </Media>
                                {message.me && <img className="avatar avatar-border-white" src={message.image} alt="user" /> }
                            </Col>
                        )}
                    </Row>
                </div>
                <Form className="bg-light rounded shadow-sm" action="#">
                    <InputGroup>
                        <Input type="textarea" className="border-0 p-4 bg-light text-sm" placeholder="Type a message" aria-describedby="button-sendMessage" />
                        <InputGroupAddon addonType="append">
                            <Button color="link" id="button-sendMessage" type="submit"><i className="fa fa-paper-plane" /></Button>
                        </InputGroupAddon>

                    </InputGroup>
                </Form>
            </Container>
        </section>
    )
};

export default UserInvoice