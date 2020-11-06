import React from 'react'
import Link from 'next/link'
import { csrfToken } from 'next-auth/client'
import { Container, Row, Col, Button, Form } from 'reactstrap'

export async function getServerSideProps(context) {
    return {
        props: {
            title: "Sign in",
            hideHeader: true,
            hideFooter: true,
            noPaddingTop: true,
            csrfToken: await csrfToken(context)
        },
    }
}

const Login = (props) => {
    return (
        <Container fluid className="px-3">
            <Row className="min-vh-100">
                <Col md="8" lg="6" xl="5" className="d-flex align-items-center">
                    <div className="w-100 py-5 px-md-5 px-xl-6 position-relative">
                        <div className="mb-5">
                            <img
                                src="/content/svg/logo-square.svg"
                                alt="..."
                                style={{ maxWidth: "4rem" }}
                                className="img-fluid mb-3"
                            />
                            <h2>Welcome back</h2>
                        </div>
                        <Form action="http://localhost:3000/api/auth/signin/facebook" method="post">
                            <input name="csrfToken" type="hidden" defaultValue={props.csrfToken} />
                            <input name="callbackUrl" type="hidden" value="http://localhost:3000" />
                            <Button
                                color="outline-primary"
                                block
                                className="btn-social mb-3"
                            >
                                <i className="fa-2x fa-facebook-f fab btn-social-icon" />
                                Sign in&nbsp;
                                <span className="d-none d-sm-inline">
                                    with Facebook
                                </span>
                            </Button>
                        </Form>
                        <Form action="http://localhost:3000/api/auth/signin/twitter" method="post">
                            <input name="csrfToken" type="hidden" defaultValue={props.csrfToken} />
                            <input name="callbackUrl" type="hidden" value="http://localhost:3000" />
                            <Button
                                color="outline-primary"
                                block
                                className="btn-social mb-3"
                            >
                                <i className="fa-2x fa-twitter fab btn-social-icon" />
                                Sign in&nbsp;
                                <span className="d-none d-sm-inline">
                                    with Twitter
                                </span>
                            </Button>
                        </Form>
                        <Form action="http://localhost:3000/api/auth/signin/google" method="post">
                            <input name="csrfToken" type="hidden" defaultValue={props.csrfToken} />
                            <input name="callbackUrl" type="hidden" value="http://localhost:3000" />
                            <Button
                                color="outline-primary"
                                block
                                className="btn-social mb-3"
                            >
                                <i className="fa-2x fa-google fab btn-social-icon" />
                                Sign in&nbsp;
                                <span className="d-none d-sm-inline">
                                    with Google
                                </span>
                            </Button>
                        </Form>
                        <hr className="my-4" />
                        <p className="text-center">
                            <small className="text-muted text-center">
                                Don't have an account yet?&nbsp;
                                <Link href="/signup">
                                    <a>Sign up</a>
                                </Link>
                            </small>
                        </p>                        
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

export default Login;