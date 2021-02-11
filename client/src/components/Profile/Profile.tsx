import React from 'react';
import { Container, Row, Col, Image, ProgressBar, Form, NavDropdown } from 'react-bootstrap';

import Layout from '../Layout/Layout';

import './Profile.scss';
import '../Layout/Steps.scss';

export default function Profile() {
  const sportInput = <div className="profile-sport-input-wrapper">
    <Form.Control className="d-inline-block" placeholder="Select your sport" readOnly />
    <div className="profile-sport-input-btn"/>
  </div>

  return (
    <Layout>
      <ProgressBar now={33} />
      <section className="profile-page">
        <Container>
          <Row>
            <Col className="text-label label-with-separator">Create your account</Col>
          </Row>
          <Row className="text-headline">
            <Col xs="9">Your Profile</Col>
            <Col xs="3" className="text-right step-title">Step 1</Col>
          </Row>
          <hr className="d-none d-md-block"/>
          <Row className="pt-3 pt-md-0">
            <Col md="6">
              <div className="profile-page-avatar w-100">
                <Image src="/content/img/users/reviewer-1.webp" roundedCircle/>
                <button className="picture-upload-btn text-label text-all-cups">change photo</button>
              </div>
            </Col>
            <Col md="6">
              <Form className="profile-form">
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control placeholder="Enter your name" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Sport</Form.Label>
                  <NavDropdown title={sportInput} id="sportsListDropdown" className="sports-list-dropdown">
                    <NavDropdown.Item>Artistic Swimming</NavDropdown.Item>
                    <NavDropdown.Item>Baseball</NavDropdown.Item>
                    <NavDropdown.Item>Basketball</NavDropdown.Item>
                    <NavDropdown.Item>Karate</NavDropdown.Item>
                    <NavDropdown.Item>MLS</NavDropdown.Item>
                  </NavDropdown>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Team</Form.Label>
                  <Form.Control placeholder="Enter your team name" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Why you are doing this (edit whenever)</Form.Label>
                  <Form.Control as="textarea" rows={5} placeholder="Enter description" />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>

        <Container fluid className="steps-navigation-container">
          <Row className="pl-4 pr-4">
            <Col xs="6" className="steps-navigation-items">
              <div className="steps-prev-btn disabled text-subhead">
                Prev
              </div>
            </Col>
            <Col xs="6" className="steps-navigation-items">
              <a href="/charities" className="btn btn-with-arrows steps-next-btn float-right">
                Next
              </a>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};
