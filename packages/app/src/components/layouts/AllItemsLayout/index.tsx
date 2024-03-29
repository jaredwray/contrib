import { FC } from 'react';

import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';

import Layout from 'src/components/layouts/Layout';

import Pagination from './Pagination';
import PaginationInfo from './PaginationInfo';
import SortBy from './SortBy';
import styles from './styles.module.scss';

export const PER_PAGE = 24;

interface Props {
  filters: React.ReactNode;
  changeFilters: (key: string, value: any) => void;
  size: number;
  skip: number;
  totalItems: number;
  sortOptions: { value: string; label: string }[];
  oldStyle?: boolean;
  charityName?: string;
}

export const AllItemsLayout: FC<Props> = ({
  filters,
  changeFilters,
  size,
  skip,
  sortOptions,
  totalItems,
  children,
  oldStyle,
  charityName,
}) => {
  return (
    <Layout>
      <Container className="p-0" fluid="xxl">
        {charityName && (
          <Row className={clsx(styles.row, 'text-center p-3')}>
            <Col>{`Live Auctions from ` + charityName}</Col>
          </Row>
        )}
        <Row className={clsx(styles.row, 'h-100 flex-grow-1')}>
          {filters && (
            <Col className={clsx(styles.filtersWrapper, 'pb-0 pb-sm-4')} md="4" xl="3">
              {filters}
            </Col>
          )}
          <Col className={clsx(styles.rightBlock, 'hv-100 px-3')}>
            <Row className="p-md-3 py-2 flex-column-reverse flex-md-row">
              <Col className="mt-3 mt-md-0" md="6">
                <PaginationInfo
                  pageSize={size || 0}
                  pageSkip={skip || 0}
                  perPage={PER_PAGE}
                  totalItems={totalItems || 0}
                />
              </Col>
              <Col md="6">
                <SortBy changeFilters={changeFilters} sortOptions={sortOptions} />
              </Col>
            </Row>
            <div className={clsx(styles.items, oldStyle && styles.itemsOldStyle, 'd-grid align-items-center')}>
              {children}
            </div>
            <Pagination
              changeFilters={changeFilters}
              pageSize={size || 0}
              pageSkip={skip || 0}
              perPage={PER_PAGE}
              totalItems={totalItems || 0}
            />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};
