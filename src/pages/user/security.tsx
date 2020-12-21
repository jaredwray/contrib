import React from 'react'
import Link from 'next/link'
import { Container, Row, Col, Button, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { connectToDatabase } from 'src/services/mongodb'
import { ObjectID } from 'mongodb'
import { getSession } from 'next-auth/client'

export async function getServerSideProps(context) {
    const session = await getSession(context)
    const { docs } = await connectToDatabase()
    const user = await docs.users().findOne({ email: session.user.email })
    const accounts = await docs.accounts().find({ userId: new ObjectID(user._id) }).toArray()

    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "Sign in & security",
            accounts: JSON.parse(JSON.stringify(accounts))
        },
    }
}

const UserSecurity = (props) => {
    const accounts = props.accounts
    const facebookConnected = accounts.find(a => a.providerId == 'facebook')
    const twitterConnected = accounts.find(a => a.providerId == 'twitter')
    const googleConnected = accounts.find(a => a.providerId == 'google')

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
                        <Link href="/user/account">
                            <a>Account</a>
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        Sign in &amp; security
                    </BreadcrumbItem>
                </Breadcrumb>

                <h1 className="hero-heading mb-0">Sign in &amp; security</h1>
                <p className="text-muted mb-5">Manage your social accounts connections here.</p>
                <Row>
                    <Col lg="7">
                        <div className="text-block">
                            <h3 className="mb-4">Social accounts</h3>
                            <Row>
                                <Col sm="8">
                                    <h6>Facebook</h6>
                                    <p className="text-sm text-muted">{ facebookConnected ? 'Connected' : 'Not connected'}</p>
                                </Col>
                                <Col className="text-right">
                                    <Button color="link" className="pl-0 text-primary">{ facebookConnected ? 'Disconnect' : 'Connect'}</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="8">
                                    <h6>Twitter</h6>
                                    <p className="text-sm text-muted">{ twitterConnected ? 'Connected' : 'Not connected'}</p>
                                </Col>
                                <Col className="text-right">
                                    <Button color="link" className="pl-0 text-primary">{ twitterConnected ? 'Disconnect' : 'Connect'}</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="8">
                                    <h6>Google</h6>
                                    <p className="text-sm text-muted">{ googleConnected ? 'Connected' : 'Not connected'}</p>
                                </Col>
                                <Col className="text-right">
                                    <Button color="link" className="pl-0 text-primary">{ googleConnected ? 'Disconnect' : 'Connect'}</Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section >
    )
}

export default UserSecurity