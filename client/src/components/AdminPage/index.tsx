import { FC } from 'react';

import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';

import Layout from 'src/components/Layout';
import SearchInput from 'src/components/SearchInput';
import { Charity } from 'src/types/Charity';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import Pagination, { PER_PAGE } from '../Pagination';
import styles from './styles.module.scss';

interface Items {
  items: InfluencerProfile[] | Charity[] | [];
  skip: number;
  totalItems: number;
}
interface Props {
  items: Items;
  pageSkip: number;
  setPageSkip: (x: number) => void;
  loading: boolean;
  controlBtns?: React.ReactNode;
  onChange?: (value: string) => void;
  onCancel?: () => void;
}

export const AdminPage: FC<Props> = ({
  items,
  pageSkip,
  setPageSkip,
  loading,
  controlBtns,
  children,
  onChange,
  onCancel,
}) => {
  const showPrevPage = () => {
    setPageSkip(pageSkip - PER_PAGE);
  };

  const showNextPage = () => {
    setPageSkip(pageSkip + PER_PAGE);
  };
  return (
    <Layout>
      <section className={clsx(styles.page, 'text-label p-sm-4 p-1 pt-4 pb-2')}>
        <Container fluid>
          <Row>
            <Col className={styles.searchInput} md="4">
              <SearchInput placeholder="Search" onCancel={onCancel} onChange={onChange!} />
            </Col>
            <Col className={clsx(styles.pagination, 'pt-3 pt-md-0 pr-0 pl-md-0 text-nowrap')} md="3" sm="5">
              <Pagination
                loading={loading}
                showNextPage={showNextPage}
                showPrevPage={showPrevPage}
                skip={items.skip}
                total={items.totalItems}
              />
            </Col>
            <Col className="pt-3 pt-md-0 text-sm-right text-center" md="5" sm="7">
              {controlBtns}
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col className="w-100">{!loading && children}</Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};
