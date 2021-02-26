import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { Container, Row, Col } from 'react-bootstrap';

import './styles.scss';

export default function Banner() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <section className="banner">
      <Container className="wrapper homepage-container position-relative h-100" fluid="sm">
        <Row>
          <Col className="pt-5 pt-md-4 pt-lg-5 pb-3 pb-md-4 pb-lg-4 text-super" lg="8" xs="6">
            Make An Impact
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="banner-separator" />
          </Col>
        </Row>
        <Row>
          <Col className="pt-3 pb-3 text-headline" lg="8" xs="12">
            Auction your memorabelia quickly and hassle free
          </Col>
        </Row>
        {!isAuthenticated && (
          <Row>
            <Col xs="6">
              <a
                className="btn btn-ochre btn-with-arrows banner-sign-up-button"
                href="/"
                onClick={() => loginWithRedirect({ page_type: 'sign_up' })}
              >
                Sign Up
              </a>
            </Col>
          </Row>
        )}
        <Row>
          <Col className="text-label text-all-cups position-absolute banner-signature" sm="6" xs="9">
            Stephan Frei
            <br />
            Total raised: $248,000
          </Col>
        </Row>
      </Container>
    </section>
  );
}
