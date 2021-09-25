import { FC } from 'react';

import clsx from 'clsx';
import { Row, Col } from 'react-bootstrap';

import Layout from 'src/components/Layout';

import Pagination from './Pagination';
import PaginationInfo from './PaginationInfo';
import SortBy from './SortBy';
import styles from './styles.module.scss';

const PER_PAGE = 20;

interface Props {
  filters: React.ReactNode;
  changeFilters: (key: string, value: any) => void;
  size: number;
  skip: number;
  totalItems: number;
  sortOptions: { value: string; label: string }[];
}
const AuctionsPage: FC<Props> = ({ filters, changeFilters, size, skip, sortOptions, totalItems, children }) => {
  return (
    <Layout>
      <Row className={clsx(styles.row, 'h-100 flex-grow-1')}>
        <Col className={clsx(styles.filtersWrapper, 'pb-0 pb-sm-4')} lg="3" md="4" sm="12">
          {filters}
        </Col>
        <Col className={clsx(styles.rightBlock, 'hv-100 w-100 pl-3 pl-lg-5 pr-3 pr-lg-5 mt-1')} md="8">
          <div className={clsx(styles.topPanel, 'mb-5 mb-sm-0')}>
            <SortBy changeFilters={changeFilters} sortOptions={sortOptions} />
            <PaginationInfo pageSize={size || 0} pageSkip={skip || 0} perPage={PER_PAGE} totalItems={totalItems || 0} />
          </div>
          <div className={clsx(styles.auctions, 'd-grid align-items-center')}>{children}</div>
          <Pagination
            changeFilters={changeFilters}
            pageSize={size || 0}
            pageSkip={skip || 0}
            perPage={PER_PAGE}
            totalItems={totalItems || 0}
          />
        </Col>
      </Row>
    </Layout>
  );
};

export default AuctionsPage;
