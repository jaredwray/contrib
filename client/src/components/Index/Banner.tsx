import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';

import './Banner.scss';

export default function Banner() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <section className="banner">
      <Container fluid="sm" className="wrapper homepage-container position-relative h-100">
        <Row>
          <Col xs="6" lg="8" className="pt-5 pt-md-4 pt-lg-5 pb-3 pb-md-4 pb-lg-4 text-super">
            Make An Impact
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="banner-separator" />
          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="8" className="pt-3 pb-3 text-headline">
            Auction your memorabelia quickly and hassle free
          </Col>
        </Row>
        {!isAuthenticated && (
          <Row>
            <Col xs="6">
              <a
                href="/"
                className="btn btn-ochre btn-with-arrows banner-sign-up-button"
                onClick={() => loginWithRedirect({ page_type: 'sign_up' })}
              >
                Sign Up
              </a>
            </Col>
          </Row>
        )}
        <Row>
          <Col xs="9" sm="6" className="text-label text-all-cups position-absolute banner-signature">
            Stephan Frei
            <br />
            Total raised: $248,000
          </Col>
        </Row>
      </Container>
    </section>
  );
}
