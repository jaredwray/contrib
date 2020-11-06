import React from 'react'
import Link from 'next/link'

import { Container, Row, Col, Button, Collapse, Badge, Form, Input, Label, Media, Card, CardHeader, CardBody, Breadcrumb, BreadcrumbItem } from 'reactstrap'

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
            title: "Personal & security - forms"
        },
    }
}

const UserSecurity = () => {

    const [loginCollapse, setLoginCollapse] = React.useState(false)

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
                        <Link href="/">
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
                            <h3 className="mb-4">Login</h3>
                            <Row>
                                <Col sm="8">
                                    <h6>Password</h6>
                                    <p className="text-sm text-muted">Last updated 3 years ago</p>
                                </Col>
                                <Col className="text-right">
                                    <Button
                                        onClick={() => setLoginCollapse(!loginCollapse)}
                                        color="link"
                                        className="pl-0 text-primary"
                                    >
                                        Update
                                    </Button>
                                </Col>
                            </Row>
                            <Collapse isOpen={loginCollapse}>
                                <Form>
                                    <Row className="mt-4">
                                        <Col xs="12" className="form-group">
                                            <Label for="password-current" className="form-label">
                                                Current Password
                                            </Label>
                                            <Input type="password" name="password-current" id="password-current" />
                                        </Col>
                                        <Col md="6" className="form-group">
                                            <Label for="password-new" className="form-label">
                                                New Password
                                            </Label>
                                            <Input type="password" name="password-new" id="password-new" />
                                        </Col>
                                        <Col md="6" className="form-group">
                                            <Label for="password-confirm" className="form-label" >
                                                Confirm Password
                                            </Label>
                                            <Input type="password" name="password-confirm" id="password-confirm" />
                                        </Col>
                                    </Row>
                                    <Button type="submit" color="outline-primary">
                                        Update Password
                                    </Button>
                                </Form>
                            </Collapse>
                        </div>
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
                    <Col md="6" lg="4" className="ml-lg-auto">
                        <Card className="border-0 shadow">
                            <CardHeader className="bg-primary-light py-4 border-0">
                                <Media className="align-items-center">
                                    <Media body>
                                        <h4 className="h6 subtitle text-sm text-primary">
                                            Let's make your account more secure
                                        </h4>
                                    </Media>
                                    <svg className="svg-icon svg-icon svg-icon-light w-3rem h-3rem ml-3 text-primary">
                                        <use xlinkHref="/content/svg/orion-svg-sprite.svg#shield-security-1"> </use>
                                    </svg>
                                </Media>
                            </CardHeader>
                            <CardBody className="p-4">
                                <h6 className="card-text">
                                    Your account security:
                                </h6>
                                <p className="card-text mb-4">
                                    <Badge color="info-light">Medium</Badge>
                                </p>
                                <p className="text-muted card-text">We’re always working on ways to increase safety in our community. </p>
                                <p className="text-muted card-text">That’s why we look at every account to make sure it’s as secure as possible.</p>
                                <hr />
                                <Button color="outline-primary" size="sm">
                                    Improve
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section >
    )
};

export default UserSecurity;