import React from 'react'
import Link from 'next/link'

import { Container, Row, Col, Button, Badge, Media, Breadcrumb, BreadcrumbItem } from 'reactstrap'

import data from '../data/user-security.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggedUser: true,
            title: "Sign in & security"
        },
    }
}

const UserSecurity = () => {
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
                        <Link href="/user-account">
                            <a>Account</a>
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        {data.title}
                    </BreadcrumbItem>
                </Breadcrumb>

                <h1 className="hero-heading mb-0">{data.title}</h1>
                <p className="text-muted mb-5">{data.subtitle}</p>
                <Row>
                    <Col lg="7">
                        <div className="text-block">
                            <h3 className="mb-4">Social accounts</h3>
                            <Row>
                                <Col sm="8">
                                    <h6>Facebook</h6>
                                    <p className="text-sm text-muted">Not connected</p>
                                </Col>
                                <Col className="text-right">
                                    <Button color="link" className="pl-0 text-primary">Connect</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="8">
                                    <h6>Twitter</h6>
                                    <p className="text-sm text-muted">Connected</p>
                                </Col>
                                <Col className="text-right">
                                    <Button color="link" className="pl-0 text-primary">Disconnect</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="8">
                                    <h6>Google</h6>
                                    <p className="text-sm text-muted">Connected</p>
                                </Col>
                                <Col className="text-right">
                                    <Button color="link" className="pl-0 text-primary">Disconnect</Button>
                                </Col>
                            </Row>
                        </div>
                        <div className="text-block mb-5 mb-lg-0">
                            <h3 className="mb-4">Device history</h3>
                            <Media>
                                <div className="icon-rounded bg-secondary-light">
                                    <svg className="svg-icon text-secondary w-2rem h-2rem">
                                        <use xlinkHref="/content/svg/orion-svg-sprite.svg#imac-screen-1" />
                                    </svg>
                                </div>
                                <Media className="pt-2 ml-3" body>
                                    <strong>Windows 10.0 </strong>· Chrome&nbsp;
                                    <Badge color="secondary-light" className="text-uppercase">Current  Session</Badge>
                                    <p className="text-sm text-muted">Ostrava, Moravskoslezsky kraj · April 6, 2020 at 01:51pm</p>
                                    <Button color="text" className="text-primary pl-0">
                                        Log out device
                                </Button>
                                </Media>
                            </Media>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section >
    )
};

export default UserSecurity;