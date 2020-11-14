import React from 'react'
import Link from 'next/link'
import { csrfToken } from 'next-auth/client'
import { Container, Row, Col, Button, Form } from 'reactstrap'

export async function getServerSideProps(context) {
    return {
        props: {
            title: 'Sign up',
            hideHeader: true,
            hideFooter: true,
            noPaddingTop: true,
            csrfToken: await csrfToken(context),
            authUrl: process.env.NEXTAUTH_URL + '/api/auth/signin',
            returnToUrl: process.env.NEXTAUTH_URL
        }
    }
}

const Signup = (props) => {
    return (
        <Container fluid className="px-3">
            <Row className="min-vh-100">
                <Col md="8" lg="6" xl="5" className="d-flex align-items-center">
                    <div className="w-100 py-5 px-md-5 px-xl-6 position-relative">
                        <div className="mb-4">
                            <img
                                src="/content/svg/logo-square.svg"
                                alt="Contrib logo"
                                style={{ maxWidth: "4rem" }}
                                className="img-fluid mb-3" />
                            <h2>Sign up</h2>
                            <p className="text-muted">You're just a few steps away from scoring gear and doing some good.</p>
                        </div>
                        <Form action={`${props.authUrl}/facebook`} method="post">
                            <input name="csrfToken" type="hidden" defaultValue={props.csrfToken} />
                            <input name="callbackUrl" type="hidden" value={props.returnToUrl} />
                            <Button
                                color="outline-primary"
                                block
                                className="btn-social mb-3">
                                <i className="fa-2x fa-facebook-f fab btn-social-icon" />
                                Sign up&nbsp;
                                <span className="d-none d-sm-inline">
                                    with Facebook
                                </span>
                            </Button>
                        </Form>
                        <Form action={`${props.authUrl}/twitter`} method="post">
                            <input name="csrfToken" type="hidden" defaultValue={props.csrfToken} />
                            <input name="callbackUrl" type="hidden" value={props.returnToUrl} />
                            <Button
                                color="outline-primary"
                                block
                                className="btn-social mb-3">
                                <i className="fa-2x fa-twitter fab btn-social-icon" />
                                Sign up&nbsp;
                                <span className="d-none d-sm-inline">
                                    with Twitter
                                </span>
                            </Button>
                        </Form>
                        <Form action={`${props.authUrl}/google`} method="post">
                            <input name="csrfToken" type="hidden" defaultValue={props.csrfToken} />
                            <input name="callbackUrl" type="hidden" value={props.returnToUrl} />
                            <Button
                                color="outline-primary"
                                block
                                className="btn-social mb-3">
                                <i className="fa-2x fa-google fab btn-social-icon" />
                                Sign up&nbsp;
                                <span className="d-none d-sm-inline">
                                    with Google
                                </span>
                            </Button>
                        </Form>
                        <hr className="my-4" />
                        <p className="text-center">
                            <small className="text-muted text-center">
                                Already have an account?&nbsp;
                                    <Link href="/signin">
                                    <a>Sign in</a>
                                </Link>
                            </small>
                        </p>

                        <p className="text-sm text-muted">By signing up you agree to Contrib's <a href="/about/terms">Terms &amp; Conditions</a> and <a href="/about/privacy">Privacy Policy</a>.</p>                        
                        <Link href="/">
                            <a className="close-absolute mr-md-5 mr-xl-6 pt-5">
                                <svg className="svg-icon w-3rem h-3rem">
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
};

export default Signup;