import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Logo from 'src/assets/images/contrib-logo-vertical-negative.svg';

import styles from './styles.module.scss';

export default function Footer() {
  return (
    <footer className={clsx('d-print-none p-0 p-md-4 pt-4 pb-4', styles.footer)}>
      <Container fluid="xxl">
        <Row>
          <Col sm="12" md="5" className={clsx(styles.footerCopy, "p-0 text-center text-md-start"}>
            <div className={styles.footerNav}>
              <Link className={clsx('privacy', styles.link)} to="/privacy-policy">
                Auctions
              </Link>
              &nbsp; &middot; &nbsp;
              <Link className={clsx('privacy', styles.link)} to="/terms">
                Influencers
              </Link>
              &nbsp; &middot; &nbsp;
              <Link className={clsx('privacy', styles.link)} to="/terms">
                Charities
              </Link>
            </div>
            <div className={styles.privacyPolicy}>
              <Link className={clsx('privacy', styles.link)} to="/privacy-policy">
                Privacy Policy
              </Link>
              &nbsp; &middot; &nbsp;
              <Link className={clsx('privacy', styles.link)} to="/terms">
                Terms
              </Link>
              &nbsp; &middot; &nbsp; &copy;{new Date().getFullYear()} Contrib Inc.
            </div>
          </Col>
          <Col sm="12" md={{ span: 2, offset: 5 }} className="p-0 text-center text-md-end pt-4 pt-md-0">
            <Link to="/">
              <img alt="Contrib" className={styles.logo} src={Logo} />
            </Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
