import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Logo from 'src/assets/images/logo-with-text-white.svg';

import styles from './styles.module.scss';

export default function Footer() {
  return (
    <footer className={clsx('d-print-none pl-0 p-4 pl-sm-4', styles.footer)}>
      <Container fluid>
        <Row>
          <Col md className="p-0 pl-md-4">
            <Link to="/">
              <img alt="Contrib" className={styles.logo} src={Logo} />
            </Link>
          </Col>
        </Row>
        <Row className={clsx('pt-4 pb-4', styles.info)}>
          <Col className="p-0 pl-md-4 pr-md-4 text-headline">Direct influencer-to-fan charity auctions.</Col>
        </Row>
        {/*
            <Row className={styles.socialMedia}>
              <Col md className="p-0 pl-md-4 pr-md-4 pt-lg-4 pb-4">
                <a className={clsx('d-inline-block mr-4', styles.twitter)} href="/" rel="external" title="twitter">
                  <i className="d-none" />
                </a>
                <a className={clsx('d-inline-block mr-4', styles.instagram)} href="/" rel="external" title="instagram">
                  <i className="d-none" />
                </a>
                <a className={clsx('d-inline-block mr-4', styles.facebook)} href="/" rel="external" title="facebook">
                  <i className="d-none" />
                </a>
              </Col>
            </Row>
          */}
        <Row>
          <Col md className="p-0 pl-md-4 pr-md-4 text-label text-all-cups">
            Copyright {new Date().getFullYear()} Contrib Inc.
          </Col>
        </Row>
        <Row>
          <Col md className="p-0 pt-md-0 pl-md-4 pr-md-4">
            <div className="text-label text-all-cups">
              <Link className={clsx('privacy', styles.link)} to="/privacy-policy">
                Privacy
              </Link>
              &#160;and&#160;
              <Link className={clsx('privacy', styles.link)} to="/terms">
                Terms
              </Link>
              &#160;&gt;&gt;
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
