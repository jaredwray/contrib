import { FC } from 'react';

import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router';

import SearchInput from 'src/components/forms/inputs/SearchInput';
import Layout from 'src/components/layouts/Layout';
import { useUrlQueryParams } from 'src/helpers/useUrlQueryParams';
import { Charity } from 'src/types/Charity';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import Pagination, { PER_PAGE } from '../../customComponents/Pagination';
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
  const history = useHistory();
  const { pathname } = useLocation();
  const query = useUrlQueryParams().get('q');
  const page = Number(useUrlQueryParams().get('p'));

  const baseurl = `${pathname}?${query ? `q=${query}&` : ''}p=`;

  const showPrevPage = () => {
    setPageSkip(pageSkip - PER_PAGE);
    history.push(`${baseurl}${page - 1}`);
  };
  const showNextPage = () => {
    setPageSkip(pageSkip + PER_PAGE);
    history.push(`${baseurl}${page ? page + 1 : 2}`);
  };
  return (
    <Layout>
      <section className={clsx(styles.page, 'text-label p-sm-4 p-1 pt-4 pb-2')}>
        <Container fluid>
          <Row>
            <Col className={styles.searchInput} md={controlBtns ? '4' : '8'}>
              {onChange ? (
                <SearchInput placeholder="Search" searchQuery={searchQuery} onCancel={onCancel} onChange={onChange!} />
              ) : (
                <input className="form-control" placeholder="Search"></input>
              )}
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
            {controlBtns && (
              <Col className="pt-3 pt-md-0 text-sm-right text-center" md="5" sm="7">
                {controlBtns}
              </Col>
            )}
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col className="w-100">{(process.title === 'browser' ? !loading : true) && children}</Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};
