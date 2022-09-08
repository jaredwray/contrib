import { FC, useState, useCallback, useEffect, useMemo } from 'react';

import { useLazyQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

import { AuctionPriceLimitsQuery, AuctionsListQuery } from 'src/apollo/queries/auctions';
import AuctionCard from 'src/components/custom/AuctionCard';
import { AllItemsLayout, PER_PAGE } from 'src/components/layouts/AllItemsLayout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { Auction, AuctionStatus } from 'src/types/Auction';

const AuctionGroupPage: FC = () => {
  const [getPriceLimits, { data: auctionPriceLimitsData }] = useLazyQuery(AuctionPriceLimitsQuery);
  const auctionPriceLimits = auctionPriceLimitsData?.auctionPriceLimits;

  const charityName = useParams<{ charityName: string }>().charityName;
  let charityId = null;
  if (charityName === 'negu') {
    charityId = '622976aa86bac00003ece369';
  }

  if (charityName === 'seattle-childrens') {
    charityId = '6171b1d56fa84a00036ade09';
  }

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
    status: [AuctionStatus.ACTIVE],
    charity: charityId,
  });

  const [executeAuctionsSearch, { data: auctionsData }] = useLazyQuery(AuctionsListQuery);
  const auctions = auctionsData?.auctions;
  const changeFilters = useCallback((key: string, value: any) => {
    setFilters((prevState: any) => {
      return { ...prevState, pageSkip: 0, [key]: value };
    });
  }, []);

  const auctionStatuses = useMemo(() => [AuctionStatus.ACTIVE, AuctionStatus.SETTLED, AuctionStatus.SOLD], []);

  useEffect(() => changeFilters('bids', initialBids), [auctionPriceLimits, changeFilters, initialBids]);
  useEffect(() => {
    const queryFilters = {} as { [key: string]: any };

    if (filters.charity) {
      queryFilters['charity'] = filters.charity;
    }
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

  setPageTitle(`${charityName} Auctions`);

  const sortByEnum = [
    { value: 'CREATED_AT_DESC', label: 'Newest' },
    { value: 'ENDING_SOON', label: 'Ending soon' },
    { value: 'PRICE_ASC', label: 'Price: Low to high' },
    { value: 'PRICE_DESC', label: 'Price: High to low' },
  ];
  return (
    <AllItemsLayout
      changeFilters={changeFilters}
      charityName={charityName.replace(/-/g, ' ')}
      filters={''}
      size={auctions?.size}
      skip={auctions?.skip}
      sortOptions={sortByEnum}
      totalItems={auctions?.totalItems}
    >
      {(auctions?.items || []).map((auction: Auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </AllItemsLayout>
  );
};

export default AuctionGroupPage;
