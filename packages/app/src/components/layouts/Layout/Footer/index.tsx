import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Logo from 'src/assets/images/contrib-logo-vertical-negative.svg';

import styles from './styles.module.scss';

export default function Footer() {
  return (
    <footer className={clsx('d-print-none px-0 py-4 p-md-4', styles.footer)}>
      <Container className="p-0" fluid="xxl">
        <Row className="align-items-center">
          <Col className="p-0 text-center text-md-start" md="11">
            <div className={clsx(styles.footerNav, 'text--body mb-1')}>
              <Link to="/auctions">Auctions</Link>
              &nbsp; &middot; &nbsp;
              <Link to="/influencers">Influencers</Link>
              &nbsp; &middot; &nbsp;
              <Link to="/charities">Charities</Link>
            </div>
            <div className={clsx(styles.privacyPolicy, 'text-body-new')}>
              <Link to="/privacy-policy">Privacy Policy</Link>
              &nbsp; &middot; &nbsp;
              <Link to="/terms">Terms</Link>
              &nbsp; &middot; &nbsp; &copy;{new Date().getFullYear()} Contrib Inc.
            </div>
          </Col>
          <Col className="p-0 text-center text-md-end pt-4 pt-md-0" md="1">
            <Link to="/">
              <img alt="Contrib" className={styles.logo} src={Logo} />
            </Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
