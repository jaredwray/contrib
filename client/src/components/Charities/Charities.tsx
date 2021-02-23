import React from 'react';
import { Container, Row, Col, ProgressBar, Form } from 'react-bootstrap';

import URLSearchParam from '../../helpers/URLSearchParam';
import Layout from '../Layout/Layout';

import './Charities.scss';
import '../Layout/Steps.scss';

export default function Charities() {
  const stepByStep = URLSearchParam('sbs');

  return (
    <Layout>
      <ProgressBar now={66} />
      <section className="charities-page">
        <Container>
          <Row>
            <Col className="text-label label-with-separator">Create your account</Col>
          </Row>
          <Row className="charities-page-title text-headline">
            <Col xs="8" sm="9">
              Your charities
            </Col>
            <Col xs="4" sm="3" className="text-right step-title">
              Step 2
            </Col>
          </Row>
          <hr />
          <Row className="pt-3 pt-md-0">
            <Col md="6">
              <div className="text-subhead">Choose your charities</div>
              <div className="text-body pt-0 pt-md-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consectetur quis eu amet vitae sit sed facilisi
                suscipit volutpat.
              </div>
            </Col>
            <Col md="6" className="pt-2 pt-md-0">
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control placeholder="Search charities by name" />
              </Form.Group>
            </Col>
          </Row>
          <Row className="buffer d-none d-md-block" />
          <hr />
          <Row className="pt-3 pt-md-0">
            <Col md="6">
              <div className="text-subhead">Don’t see your charity?</div>
              <div className="text-body pt-0 pt-md-2">
                If your charity isn’t listed send us their info and we will add them to Contrib.
              </div>
            </Col>
            <Col md="6" className="pt-2 pt-md-0">
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder="Enter charity name" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Contact</Form.Label>
                <Form.Control placeholder="Enter website or social" />
              </Form.Group>
            </Col>
          </Row>
          <Row className="buffer d-none d-md-block" />
        </Container>

        {stepByStep && (
          <Container fluid className="steps-navigation-container">
            <Row className="pl-4 pr-4">
              <Col xs="6" className="steps-navigation-items">
                <a href="/profile?sbs=true" className="steps-prev-btn text-subhead">
                  Prev
                </a>
              </Col>
              <Col xs="6" className="steps-navigation-items">
                <a href="/welcome" className="btn btn-with-arrows steps-next-btn float-right">
                  Finish
                </a>
              </Col>
            </Row>
          </Container>
        )}
      </section>
    </Layout>
  );
}
