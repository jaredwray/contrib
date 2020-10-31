import React from 'react'
import Link from 'next/link'

import { Container, Row, Col, Button, Form, Input, Label, FormGroup } from 'reactstrap'

export async function getStaticProps() {
    return {
        props: {
            title: "Sign up",
            hideHeader: true,
            hideFooter: true,
            noPaddingTop: true
        },
    }
}

export default () => {
    return (
        <Container fluid className="px-3">
            <Row className="min-vh-100">
                <Col md="8" lg="6" xl="5" className="d-flex align-items-center">
                    <div className="w-100 py-5 px-md-5 px-xl-6 position-relative">
                        <div className="mb-4">
                            <img
                                src="/content/svg/logo-square.svg"
                                alt="..."
                                style={{ maxWidth: "4rem" }}
                                className="img-fluid mb-3"
                            />
                            <h2>Sign up</h2>
                            <p className="text-muted">You're just a few steps away from scoring loot and doing some good.</p>
                        </div>
                        <Form className="form-validate">
                            <FormGroup>
                                <Label for="loginUsername" className="form-label">
                                    Email Address
                            </Label>
                                <Input
                                    name="loginUsername"
                                    id="loginUsername"
                                    type="email"
                                    placeholder="name@address.com"
                                    autoComplete="off"
                                    required
                                />
                            </FormGroup>
                            <FormGroup className="mb-4">
                                <Label
                                    for="loginPassword"
                                    className="form-label"
                                >
                                    Password
                                </Label>
                                <Input
                                    name="loginPassword"
                                    id="loginPassword"
                                    type="email"
                                    placeholder="Password"
                                    required
                                />
                            </FormGroup>
                            <FormGroup className="mb-4">
                                <Label
                                    for="loginPassword2"
                                    className="form-label"
                                >
                                    Confirm your password
                                </Label>
                                <Input
                                    name="loginPassword2"
                                    id="loginPassword2"
                                    type="email"
                                    placeholder="Password"
                                    required
                                />
                            </FormGroup>
                            <Button
                                size="lg"
                                color="primary"
                                block
                            >
                                Sign up
                            </Button>
                            <hr
                                data-content="OR"
                                className="my-3 hr-text letter-spacing-2"
                            />
                            <Button
                                color="outline-primary"
                                block
                                className="btn-social mb-3"
                            >
                                <i className="fa-2x fa-facebook-f fab btn-social-icon" />
                                Connect&nbsp;
                                <span className="d-none d-sm-inline">
                                    with Facebook
                                </span>
                            </Button>
                            <Button
                                color="outline-primary"
                                block
                                className="btn-social mb-3"
                            >
                                <i className="fa-2x fa-twitter fab btn-social-icon" />
                                Connect&nbsp;
                                <span className="d-none d-sm-inline">
                                    with Twitter
                                </span>
                            </Button>
                            <Button
                                color="outline-primary"
                                block
                                className="btn-social mb-3"
                            >
                                <i className="fa-2x fa-google fab btn-social-icon" />
                                Connect&nbsp;
                                <span className="d-none d-sm-inline">
                                    with Google
                                </span>
                            </Button>
                            <hr className="my-4" />
                            <p className="text-center">
                                <small className="text-muted text-center">
                                    Already have an account?&nbsp;
                                    <Link href="/login">
                                        <a>Sign in</a>
                                    </Link>
                                </small>
                            </p>

                            <p className="text-sm text-muted">By signing up you agree to Contrib's <a href="/about/terms">Terms and Conditions</a> and <a href="/about/privacy">Privacy Policy</a>.</p>
                        </Form>
                        <Link href="/">
                            <a className="close-absolute mr-md-5 mr-xl-6 pt-5">
                                <svg class="svg-icon w-3rem h-3rem">
                                    <use xlinkHref="/content/svg/orion-svg-sprite.svg#close-1" />
                                </svg>
                            </a>
                        </Link>
                    </div>
                </Col>
                <Col md="4" lg="6" xl="7" className="d-none d-md-block">
                    <div
                        style={{ backgroundImage: "url(/content/img/photo/photo-1497436072909-60f360e1d4b1.jpg)" }}
                        className="bg-cover h-100 mr-n3"
                    />
                </Col>
            </Row>
        </Container >
    )
}