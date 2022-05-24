import { FC } from 'react';

import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';

import Pagination from 'src/components/custom/Pagination';
import SearchInput from 'src/components/forms/inputs/SearchInput';
import Layout from 'src/components/layouts/Layout';
import { Charity } from 'src/types/Charity';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

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
  searchQuery?: string;
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
  searchQuery,
}) => {
  return (
    <Layout>
      <section className={clsx(styles.page, 'text-label p-sm-4 p-1 pt-4 pb-2')}>
        <Container fluid="xxl">
          <Row>
            <Col className={styles.searchInput} md={controlBtns ? '4' : '8'}>
              {onChange ? (
                <SearchInput placeholder="Search" searchQuery={searchQuery} onCancel={onCancel} onChange={onChange!} />
              ) : (
                <input className="form-control" placeholder="Search"></input>
              )}
            </Col>
            <Col className={clsx(styles.pagination, 'pt-3 pt-md-0 pe-0 ps-md-0 text-nowrap')} md="3" sm="5">
              <Pagination loading={loading} setPageSkip={setPageSkip} total={items.totalItems} />
            </Col>
            {controlBtns && (
              <Col className="pt-3 pt-md-0 text-end" md="5" sm="7">
                {controlBtns}
              </Col>
            )}
          </Row>
        </Container>
        <Container fluid="xxl">
          <Row>
            <Col className="w-100">{(process.title === 'browser' ? !loading : true) && children}</Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};
