import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import Logo from '../../../assets/logo.svg';
import './styles.scss';

export default function Footer() {
  return (
    <footer className="d-print-none p-4">
      <Container fluid>
        <Row className="top">
          <Col md className="p-0 pl-md-4">
            <img src={Logo} alt="Contrib" />
          </Col>
        </Row>
        <Row className="info pt-4 pb-4">
          <Col xs="12" lg="8" className="p-0 pl-md-4 pr-md-4 text-headline">
            Direct athlete-to-fan charity auctions.
          </Col>
          <Col xs="12" lg="4" className="p-0 pt-4 pt-lg-0 pl-md-4 pr-md-4 ">
            <a href="/" className="float-lg-right text-headline">
              About Contrib
            </a>
          </Col>
        </Row>
        <Row className="social-media">
          <Col md className="p-0 pl-md-4 pr-md-4 pt-lg-4 pb-4">
            <a href="/" className="twitter d-inline-block mr-4" rel="external">
              <i className="d-none" />
            </a>
            <a href="/" className="instagram d-inline-block mr-4" rel="external">
              <i className="d-none" />
            </a>
            <a href="/" className="facebook d-inline-block" rel="external">
              <i className="d-none" />
            </a>
          </Col>
        </Row>
        <Row className="bottom">
          <Col md className="p-0 pl-md-4 pr-md-4 text-label text-all-cups">
            Copyright {new Date().getFullYear()} Contrib Inc.
          </Col>
          <Col md className="pt-2 p-0 pt-md-0 pr-md-4">
            <a href="/" className="privacy float-md-right text-label text-all-cups">
              Privacy and Terms &gt;&gt;
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
