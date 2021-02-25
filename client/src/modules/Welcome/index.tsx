import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import Layout from '../../components/Layout';

import './styles.scss';

export default function WelcomePage() {
  return (
    <Layout>
      <div className="w-100 welcome-page">
        <Container className="d-md-table">
          <Container className="h-100 d-md-table-cell align-middle">
            <Row className="pt-lg-3 pt-5 align-items-center">
              <Col lg="6" className="">
                <div className="welcome-page-congratulations d-flex">
                  <div className="welcome-page-congratulation-img d-inline-block" />
                  <div className="welcome-page-congratulation-title text-label d-inline-block">Account created</div>
                </div>
                <div className="text-super pt-4 pb-lg-5 pb-3">Welcome</div>
                <div className="welcome-page-separator" />
                <div className="text-headline pt-4">Do you have something to auction?</div>
              </Col>
              <Col lg="6" className="pt-5 pt-lg-0 pb-4 pb-lg-0">
                <div className="welcome-page-right-block p-4 p-md-5">
                  <div className="d-table w-100">
                    <a
                      href="/"
                      className="text-subhead btn btn-ochre btn-with-arrows d-table-cell align-middle w-100 welcome-page-create-btn"
                    >
                      Create an auction
                    </a>
                  </div>
                  <div className="text-label label-with-separator pt-4">Explore Contrib</div>
                  <a href="/profile" className="text-label text-all-cups d-block">
                    View your account &gt;&gt;
                  </a>
                  <a href="/" className="text-label text-all-cups d-block pt-4">
                    View Auctions &gt;&gt;
                  </a>
                </div>
              </Col>
            </Row>
          </Container>
        </Container>
      </div>
    </Layout>
  );
}
