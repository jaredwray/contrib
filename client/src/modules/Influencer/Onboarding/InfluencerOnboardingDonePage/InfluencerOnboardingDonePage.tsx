import React, { FC } from 'react';

import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Layout from 'src/components/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';

import styles from './InfluencerOnboardingDonePage.module.scss';

export const InfluencerOnboardingDonePage: FC = () => {
  setPageTitle('Done page');

  return (
    <Layout>
      <div className={clsx('flex-grow-1 d-flex flex-column justify-content-center', styles.wrapper)}>
        <Container className="d-md-table w-100">
          <Container className="h-100 d-md-table-cell align-middle">
            <Row className="pt-lg-3 pt-5 align-items-center">
              <Col className={clsx(styles.leftBlock)} lg="6">
                <div className="welcome-page-congratulations d-flex">
                  <div className={clsx('d-inline-block', styles.heroImage)} />
                  <h2 className={clsx('text-label d-inline-block', styles.title)}>Account created</h2>
                </div>
                <div className="text-super pt-4 pb-lg-5 pb-3">Welcome</div>
                <div className={styles.separator} />
                <div className="text-headline pt-4">Do you have something to auction?</div>
              </Col>
              <Col className="pt-5 pt-lg-0 pb-4 pb-lg-0" lg="6">
                <div className={clsx('p-4 p-md-5', styles.rightBlock)}>
                  <div className="d-table w-100">
                    <Link
                      className={clsx(
                        'text-subhead btn btn-ochre btn-with-arrows d-table-cell align-middle w-100',
                        styles.auctionButton,
                      )}
                      to="/auctions/new"
                    >
                      Create an auction
                    </Link>
                  </div>
                  <div className="text-label label-with-separator pt-4">Explore Contrib</div>
                  <Link className="text-label text-all-cups d-block" to="/profiles/me">
                    View your account &gt;&gt;
                  </Link>
                  <Link className="text-label text-all-cups d-block pt-4" to="/auctions">
                    View Auctions &gt;&gt;
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </Container>
      </div>
    </Layout>
  );
};
