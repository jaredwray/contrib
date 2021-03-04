import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import Logo from 'src/assets/images/logo-with-text-white.svg';

import './styles.scss';

export default function Footer() {
  return (
    <footer className="d-print-none p-4">
      <Container fluid>
        <Row className="top">
          <Col md className="p-0 pl-md-4">
            <img alt="Contrib" className="logo" src={Logo} />
          </Col>
        </Row>
        <Row className="info pt-4 pb-4">
          <Col className="p-0 pl-md-4 pr-md-4 text-headline" lg="8" xs="12">
            Direct athlete-to-fan charity auctions.
          </Col>
          <Col className="p-0 pt-4 pt-lg-0 pl-md-4 pr-md-4 " lg="4" xs="12">
            <a className="float-lg-right text-headline" href="/">
              About Contrib
            </a>
          </Col>
        </Row>
        <Row className="social-media">
          <Col md className="p-0 pl-md-4 pr-md-4 pt-lg-4 pb-4">
            <a className="twitter d-inline-block mr-4" href="/" rel="external">
              <i className="d-none" />
            </a>
            <a className="instagram d-inline-block mr-4" href="/" rel="external">
              <i className="d-none" />
            </a>
            <a className="facebook d-inline-block" href="/" rel="external">
              <i className="d-none" />
            </a>
          </Col>
        </Row>
        <Row className="bottom">
          <Col md className="p-0 pl-md-4 pr-md-4 text-label text-all-cups">
            Copyright {new Date().getFullYear()} Contrib Inc.
          </Col>
          <Col md className="pt-2 p-0 pt-md-0 pr-md-4">
            <a className="privacy float-md-right text-label text-all-cups" href="/">
              Privacy and Terms &gt;&gt;
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
