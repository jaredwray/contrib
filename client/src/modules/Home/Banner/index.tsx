import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import clsx from 'clsx';
import { Container, Row, Col, Button } from 'react-bootstrap';

import styles from './styles.module.scss';

export default function Banner() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <section className={styles.banner}>
      <Container className={clsx(styles.homepageContainer, 'position-relative h-100')} fluid="sm">
        <Row>
          <Col className="pt-5 pt-md-4 pt-lg-5 pb-3 pb-md-4 pb-lg-4 text-super" lg="8" xs="6">
            Make An Impact
          </Col>
        </Row>
        <Row>
          <Col>
            <div className={styles.separator} />
          </Col>
        </Row>
        <Row>
          <Col className="pt-3 pb-3 text-headline" lg="8" xs="12">
            Auction your items quickly and hassle free
          </Col>
        </Row>
        {!isAuthenticated && (
          <Row>
            <Col xs="6">
              <Button
                className={clsx(styles.button, 'btn-with-arrows text-label')}
                variant="secondary"
                onClick={() => loginWithRedirect({ page_type: 'sign_up' })}
              >
                Sign Up
              </Button>
            </Col>
          </Row>
        )}
        <Row>
          <Col className={clsx(styles.signature, 'text-label text-all-cups position-absolute')} sm="6" xs="9">
            Stephan Frei
            <br />
            Total raised: $248,000
          </Col>
        </Row>
      </Container>
    </section>
  );
}
