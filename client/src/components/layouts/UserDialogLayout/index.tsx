import { FC, ReactNode } from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';

import Layout from 'src/components/layouts/Layout';

import styles from './styles.module.scss';

interface Props {
  title?: string;
  subtitle?: string;
  textBlock?: ReactNode;
  successBlock?: ReactNode;
  backGroundStyle?: string;
  textColorStyle?: string;
}

export const UserDialogLayout: FC<Props> = ({
  title,
  subtitle,
  textBlock,
  successBlock,
  backGroundStyle,
  textColorStyle,
  children,
}) => (
  <Layout>
    <div className={clsx(backGroundStyle || styles.page, 'w-100 d-flex')}>
      <Container className="d-md-table p-0" fluid="xxl">
        <Container
          className={clsx(
            textColorStyle || styles.container,
            styles.containerHeight,
            'p-0 h-100 d-md-table-cell align-middle',
          )}
        >
          <Row className="py-lg-3 py-5 align-items-center">
            {!successBlock ? (
              <>
                <Col lg="6">
                  {subtitle ? (
                    <>
                      <div className="text-super pt-4">{title}</div>
                      <div className="text-super pb-lg-5 pb-3 invitation-page-influencer">{subtitle}</div>
                    </>
                  ) : (
                    <div className={clsx(styles.title, 'text-super-headline pb-2 pt-0 pt-sm-4')}>{title}</div>
                  )}
                  <div className={styles.separator} />
                  {textBlock}
                </Col>
                <Col className="py-4 py-lg-0" lg="6">
                  <div className={clsx(styles.rightBlock, 'p-2 p-sm-4')}>
                    <div className="w-100">{children}</div>
                  </div>
                </Col>
              </>
            ) : (
              <Col className="d-flex justify-content-center">
                <div className={clsx(styles.successBlock, 'text-subhead pt-sm-4 pt-0 text-justify')}>
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
