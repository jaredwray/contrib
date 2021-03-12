import { FC, useState, useCallback, useEffect } from 'react';

import { useQuery, useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import { Row, Col } from 'react-bootstrap';

import { AuctionPriceLimitsQuery, AuctionsListQuery } from 'src/apollo/queries/auctions';
import { Auction } from 'src/types/Auction';

import AuctionPreview from '../AuctionPreview';
import Filters from '../Filters';
import Pagination from '../Pagination';
import PaginationInfo from '../PaginationInfo';
import SortByInput from '../SortByInput';
import styles from './styles.module.scss';

const PER_PAGE = 25;

const AuctionsOnboardingFlowAuctionsList: FC = () => {
  const { data: auctionPriceLimitsData } = useQuery(AuctionPriceLimitsQuery);
  const auctionPriceLimits = auctionPriceLimitsData?.auctionPriceLimits;

  const initialBids = auctionPriceLimits && {
    minPrice: Math.floor(auctionPriceLimits.min.amount / 100),
    maxPrice: Math.ceil(auctionPriceLimits.max.amount / 100),
  };
  const [filters, setFilters] = useState({
    query: '',
    bids: initialBids,
    sports: [],
    orderBy: 'createdAtDesc',
    pageSkip: 0,
  });
  const [executeAuctionsSearch, { data: auctionsData }] = useLazyQuery(AuctionsListQuery);
  const auctions = auctionsData?.auctions;

  useEffect(() => {
    changeFilters('bids', initialBids);
  }, [auctionPriceLimits]);

  useEffect(() => {
    const queryFilters = { sports: filters.sports } as any;

    if (filters.bids) {
      queryFilters['maxPrice'] = filters.bids.maxPrice * 100;
      queryFilters['minPrice'] = filters.bids.minPrice * 100;
    }

    executeAuctionsSearch({
      variables: {
        size: PER_PAGE,
        skip: filters.pageSkip,
        query: filters.query,
        orderBy: filters.orderBy,
        filters: queryFilters,
      },
    });
  }, [filters]);

  const changeFilters = useCallback(
    (key: string, value: any) => {
      setFilters((prevState: any) => {
        return { ...prevState, pageSkip: 0, [key]: value };
      });
    },
    [filters],
  );

  return (
    <Row className="h-100 flex-grow-1">
      <Col className="d-none d-sm-block" lg="1"></Col>
      <Col lg="3" md="4">
        <Filters changeFilters={changeFilters} filters={filters} initialBids={initialBids} />
      </Col>
      <Col className={clsx(styles.rightBlock, 'hv-100 w-100 pl-3 pl-lg-5 pr-3 pr-lg-5')} md="8">
        <div className={clsx(styles.topPanel, 'mb-5 mb-sm-0')}>
          <SortByInput changeFilters={changeFilters} orderBy={filters.orderBy} />

          <PaginationInfo
            pageSize={auctions?.size || 0}
            pageSkip={auctions?.skip || 0}
            perPage={PER_PAGE}
            totalItems={auctions?.totalItems || 0}
          />
        </div>

        <div className={clsx(styles.auctions, 'd-grid text-center')}>
          {(auctions?.items || []).map((auction: Auction) => (
            <AuctionPreview key={auction.id} auction={auction} />
          ))}
        </div>

        <Pagination
          changeFilters={changeFilters}
          pageSize={auctions?.size || 0}
          pageSkip={auctions?.skip || 0}
          perPage={PER_PAGE}
          totalItems={auctions?.totalItems || 0}
        />
      </Col>
    </Row>
  );
};

export default AuctionsOnboardingFlowAuctionsList;
