import { FC, ReactNode } from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';

import Layout from 'src/components/Layout';

import styles from './styles.module.scss';

interface Props {
  title?: string;
  subtitle?: string;
  textBlock?: ReactNode;
  successBlock?: ReactNode;
}

export const UserDialogLayout: FC<Props> = ({ title, subtitle, textBlock, successBlock, children }) => (
  <Layout>
    <div className={clsx(styles.page, 'w-100 d-flex')}>
      <Container className="d-md-table p-0">
        <Container className={clsx(styles.container, 'p-0 h-100 d-md-table-cell align-middle')}>
          <Row className="pt-lg-3 pt-5 align-items-center">
            {!successBlock ? (
              <>
                <Col lg="6">
                  {subtitle ? (
                    <>
                      <div className="text-super pt-4">{title}</div>
                      <div className="text-super pb-lg-5 pb-3 invitation-page-influencer">{subtitle}</div>
                    </>
                  ) : (
                    <div className={clsx(styles.title, 'text-super-headline pb-2 pt-mb-0 pt-4')}>{title}</div>
                  )}
                  <div className={styles.separator} />
                  {textBlock}
                </Col>
                <Col className="pt-4 pt-lg-0 pb-4 pb-lg-0" lg="6">
                  <div className={clsx(styles.rightBlock, 'p-4 p-md-4')}>
                    <div className="w-100">{children}</div>
                  </div>
                </Col>
              </>
            ) : (
              <Col className="d-flex justify-content-center">
                <div className={clsx(styles.successBlock, 'text-subhead pt-4 text-justify')}>
                  <div className="text-super-headline text-center pb-3">{title}</div>
                  {successBlock}
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </Container>
    </div>
  </Layout>
);
