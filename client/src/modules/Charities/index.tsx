import React from 'react';

import { Container, Row, Col, ProgressBar, Form } from 'react-bootstrap';

import Layout from 'src/components/Layout';
import URLSearchParam from 'src/helpers/URLSearchParam';

import './styles.scss';
import 'src/components/Layout/Steps.scss';

export default function CharitiesPage() {
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
            <Col sm="9" xs="8">
              Your charities
            </Col>
            <Col className="text-right step-title" sm="3" xs="4">
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
            <Col className="pt-2 pt-md-0" md="6">
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
            <Col className="pt-2 pt-md-0" md="6">
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
              <Col className="steps-navigation-items" xs="6">
                <a className="steps-prev-btn text-subhead" href="/profile?sbs=true">
                  Prev
                </a>
              </Col>
              <Col className="steps-navigation-items" xs="6">
                <a className="btn btn-with-arrows steps-next-btn float-right" href="/welcome">
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
