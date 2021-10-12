import { FC, useState, useCallback, useEffect, useMemo } from 'react';

import { useLazyQuery } from '@apollo/client';

import { AuctionPriceLimitsQuery, AuctionsListQuery } from 'src/apollo/queries/auctions';
import AuctionCard from 'src/components/customComponents/AuctionCard';
import { AllItemsLayout, PER_PAGE } from 'src/components/layouts/AllItemsLayout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { Auction, AuctionStatus } from 'src/types/Auction';

import Filters from './Filters';

const AuctionsPage: FC = () => {
  const [getPriceLimits, { data: auctionPriceLimitsData }] = useLazyQuery(AuctionPriceLimitsQuery);
  const auctionPriceLimits = auctionPriceLimitsData?.auctionPriceLimits;

  const initialBids = useMemo(() => {
    return (
      auctionPriceLimits && {
        minPrice: Math.floor(auctionPriceLimits.min.amount / 100),
        maxPrice: Math.ceil(auctionPriceLimits.max.amount / 100),
      }
    );
  }, [auctionPriceLimits]);

  const [filters, setFilters] = useState({
    query: '',
    bids: initialBids,
    orderBy: 'CREATED_AT_DESC',
    pageSkip: 0,
    status: [],
    charity: [],
  });

  const [executeAuctionsSearch, { data: auctionsData }] = useLazyQuery(AuctionsListQuery);
  const auctions = auctionsData?.auctions;
  const changeFilters = useCallback((key: string, value: any) => {
    setFilters((prevState: any) => {
      return { ...prevState, pageSkip: 0, [key]: value };
    });
  }, []);
  const charityChangeFilter = useCallback((key: string, value: any) => {
    setFilters((prevState: any) => {
      return { ...prevState, pageSkip: 0, [key]: value };
    });
  }, []);

  const auctionStatuses = useMemo(() => {
    return [AuctionStatus.ACTIVE, AuctionStatus.SETTLED, AuctionStatus.SOLD];
  }, []);

  useEffect(() => {
    changeFilters('bids', initialBids);
  }, [auctionPriceLimits, changeFilters, initialBids]);

  useEffect(() => {
    const queryFilters = { charity: filters.charity } as any;

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
        statusFilter: filters.status.length ? filters.status : auctionStatuses,
      },
    });
  }, [executeAuctionsSearch, filters, auctionStatuses]);

  useEffect(() => {
    const queryFilters = { charity: filters.charity };

    getPriceLimits({
      variables: {
        query: filters.query,
        filters: queryFilters,
        statusFilter: filters.status.length ? filters.status : auctionStatuses,
      },
    });
  }, [getPriceLimits, filters, auctionStatuses]);

  setPageTitle('Auctions page');

  const componentFilters = (
    <Filters
      changeFilters={changeFilters}
      charityChangeFilter={charityChangeFilter}
      filters={filters}
      initialBids={initialBids}
    />
  );
  const sortByEnum = [
    { value: 'CREATED_AT_DESC', label: 'Newest' },
    { value: 'TIME_ASC', label: 'Ending soon' },
    { value: 'PRICE_ASC', label: 'Price: Low to high' },
    { value: 'PRICE_DESC', label: 'Price: High to low' },
  ];
  return (
    <AllItemsLayout
      changeFilters={changeFilters}
      filters={componentFilters}
      size={auctions?.size}
      skip={auctions?.skip}
      sortOptions={sortByEnum}
      totalItems={auctions?.totalItems}
    >
      {(auctions?.items || []).map((auction: Auction) => (
        <AuctionCard key={auction.id} horizontal auction={auction} />
      ))}
    </AllItemsLayout>
  );
};

export default AuctionsPage;
