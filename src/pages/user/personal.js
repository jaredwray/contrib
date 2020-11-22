import React from 'react'
import Link from 'next/link'

import Select from 'react-select'

import { Container, Row, Col, Button, Collapse, Form, Input, Label, Media, Card, CardHeader, CardBody, Breadcrumb, BreadcrumbItem } from 'reactstrap'

import data from '../../data/user-personal.json'
import countries from '../../data/countries.json'
import states from '../../data/regions/us.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggedUser: true,
            title: "Personal info - forms"
        },
    }
}

const UserPersonal = () => {
    const [personalCollapse, setPersonalCollapse] = React.useState(false)
    const [addressCollapse, setAddressCollapse] = React.useState(false)

    return (
        <section className="py-5">
            <Container>
                <Breadcrumb listClassName="pl-0  justify-content-start">
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
                        Host view
                    </BreadcrumbItem>
                </Breadcrumb>


                <h1 className="hero-heading mb-0">{data.title}</h1>
                <p className="text-muted mb-5">{data.subtitle}</p>
                <Row>
                    <Col lg="7">
                        <div className="text-block">
                            <Row className="mb-3">
                                <Col sm="9">
                                    <h5>Personal details</h5>
                                </Col>
                                <Col sm="3" className="text-right">
                                    <Button
                                        color="link"
                                        className="pl-0 text-primary collapsed"
                                        onClick={() => setPersonalCollapse(!personalCollapse)}>
                                        Update
                                    </Button>
                                </Col>
                            </Row>
                            <p className="text-sm text-muted">
                                {data.personal.map((item, index) =>
                                    <React.Fragment key={index}>
                                        <i className={`fa fa-${item.icon} fa-fw mr-2`} />
                                        {item.title}
                                        {index === data.personal.length - 2 && <span className="mx-2"> | </span>}
                                        {index < data.personal.length - 2 && <br />}
                                    </React.Fragment>
                                )}
                            </p>
                            <Collapse isOpen={personalCollapse}>
                                <Form>
                                    <Row className="pt-4">
                                        <Col md="6" className="form-group">
                                            <Label for="name" className="form-label" >
                                                Name
                                            </Label>
                                            <Input type="text" name="name" id="name" defaultValue="John Doe" />
                                        </Col>
                                        <Col md="6" className="form-group">
                                            <Label for="date" className="form-label">
                                                Date of birth
                                            </Label>
                                            <Input type="text" name="date" id="date" defaultValue="06/22/1980" />
                                        </Col>
                                        <Col md="6" className="form-group">
                                            <Label for="email" className="form-label">
                                                Email address
                                            </Label>
                                            <Input type="email" name="email" id="email" defaultValue="john.doe@directory.com" />
                                        </Col>
                                        <Col md="6" className="form-group">
                                            <Label for="phone" className="form-label">
                                                Phone number
                                            </Label>
                                            <Input type="text" name="phone" id="phone" defaultValue="+42055544466" />
                                        </Col>
                                    </Row>
                                    <Button
                                        type="submit"
                                        color="outline-primary"
                                        className=" mb-4">
                                        Save your personal details
                                    </Button>
                                </Form>
                            </Collapse>
                        </div>
                        <div className="text-block">
                            <Row className="mb-3">
                                <Col sm="9">
                                    <h5>Address</h5>
                                </Col>
                                <Col sm="3" className="text-right">
                                    <Button
                                        color="link"
                                        className="pl-0 text-primary collapsed"
                                        onClick={() => setAddressCollapse(!addressCollapse)}>
                                        Change
                                    </Button>
                                </Col>
                            </Row>
                            <Media className="text-sm text-muted">
                                <i className="fa fa-address-book fa-fw mr-2" />
                                <Media body className="mt-n1">
                                    {data.address.line1}
                                    <br />
                                    {data.address.line2}
                                    <br />
                                    {data.address.region} {data.address.postCode}
                                    <br />
                                    {countries.find(c => c.value == data.address.country).label}
                                </Media>
                            </Media>
                            <Collapse isOpen={addressCollapse}>
                                <Form>
                                    <Row className="pt-4">
                                        <Col md="6" className="form-group">
                                            <Label for="street" className="form-label">Street</Label>
                                            <Input type="text" name="street" id="street" defaultValue="123 Main St." />
                                        </Col>
                                        <Col md="6" className="form-group">
                                            <Label for="apt" className="form-label">
                                                Apt. (optional)
                                            </Label>
                                            <Input type="text" name="apt" id="apt" defaultValue="Apt #7" />
                                        </Col>
                                        <Col md="6" className="form-group" >
                                            <Label for="city" className="form-label">
                                                City
                                            </Label>
                                            <Input type="text" name="city" id="city" defaultValue="San Francisco" />
                                        </Col>
                                        <Col md="6" className="form-group" >
                                            <Label for="state" className="form-label" >
                                                State
                                            </Label>
                                            <Select
                                                id="state"
                                                name="state"
                                                options={states}
                                                defaultValue={states.find(s => s.value == data.address.region)}
                                                className="selectpicker z-index-20"
                                                classNamePrefix="selectpicker"
                                            />
                                        </Col>
                                        <Col md="6" className="form-group">
                                            <Label for="zip" className="form-label">
                                                Zip
                                            </Label>
                                            <Input type="text" name="zip" id="zip" defaultValue="90210" />
                                        </Col>
                                        <Col md="6" className="form-group">
                                            <Label for="country" className="form-label">
                                                Country
                                            </Label>
                                            <Select
                                                id="country"
                                                name="country"
                                                options={countries}
                                                defaultValue={countries.find(c => c.value == data.address.country)}
                                                className="selectpicker z-index-20"
                                                classNamePrefix="selectpicker"
                                            />
                                        </Col>
                                    </Row>
                                    <Button
                                        type="submit"
                                        color="outline-primary"
                                        className=" mb-4">
                                        Save address
                                    </Button>
                                </Form>
                            </Collapse>
                        </div>
                    </Col>
                    <Col md="6" lg="4" className="ml-lg-auto">
                        <Card className="border-0 shadow">
                            <CardHeader className="bg-primary-light py-4 border-0">
                                <Media className="align-items-center">
                                    <Media body>
                                        <h4 className="h6 subtitle text-sm text-primary">
                                            What info is shared with others?
                                        </h4>
                                    </Media>
                                    <svg className="svg-icon svg-icon svg-icon-light w-3rem h-3rem ml-3 text-primary">
                                        <use xlinkHref="/content/svg/orion-svg-sprite.svg#identity-1"> </use>
                                    </svg>
                                </Media>
                            </CardHeader>
                            <CardBody className="p-4">
                                <p className="text-muted text-sm card-text">Contrib only releases information necessary for shipping between buyers and sellers <strong>after an auction is won</strong>.</p>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default UserPersonal