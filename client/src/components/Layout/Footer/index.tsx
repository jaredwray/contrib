import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';

import Logo from 'src/assets/images/logo-with-text-white.svg';

import styles from './styles.module.scss';

export default function Footer() {
  return (
    <footer className={clsx('d-print-none p-4', styles.footer)}>
      <Container fluid>
        <Row>
          <Col md className="p-0 pl-md-4">
            <img alt="Contrib" className={styles.logo} src={Logo} />
          </Col>
        </Row>
        <Row className={clsx('pt-4 pb-4', styles.info)}>
          <Col className="p-0 pl-md-4 pr-md-4 text-headline" lg="8" xs="12">
            Direct athlete-to-fan charity auctions.
          </Col>
          <Col className="p-0 pt-4 pt-lg-0 pl-md-4 pr-md-4 " lg="4" xs="12">
            <a className="float-lg-right text-headline" href="/">
              About Contrib
            </a>
          </Col>
        </Row>
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
        <Row>
          <Col md className="p-0 pl-md-4 pr-md-4 text-label text-all-cups">
            Copyright {new Date().getFullYear()} Contrib Inc.
          </Col>
          <Col md className="pt-2 p-0 pt-md-0 pr-md-4">
            <a className={clsx('privacy float-md-right text-label text-all-cups', styles.link)} href="/">
              Privacy and Terms &gt;&gt;
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
