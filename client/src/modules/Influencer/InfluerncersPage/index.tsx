import { FC, useState, useCallback, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';

import { InfluencersListQuery } from 'src/apollo/queries/influencers';
import { AllItemsLayout, PER_PAGE } from 'src/components/layouts/AllItemsLayout';
import ItemCard from 'src/components/layouts/AllItemsLayout/ItemCard';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { InfluencerProfile, InfluencerStatus } from 'src/types/InfluencerProfile';

import Filters from './Filters';

const InfluencersPage: FC = () => {
  const [filters, setFilters] = useState({
    query: '',
    orderBy: 'ONBOARDED_AT_ASC',
    pageSkip: 0,
  });

  const [executeAuctionsSearch, { data }] = useLazyQuery(InfluencersListQuery);

  const influencersData = data?.influencersList;
  const changeFilters = useCallback((key: string, value: any) => {
    setFilters((prevState: any) => {
      return { ...prevState, pageSkip: 0, [key]: value };
    });
  }, []);

  useEffect(() => {
    executeAuctionsSearch({
      variables: {
        size: PER_PAGE,
        skip: filters.pageSkip,
        orderBy: filters.orderBy,
        filters: { query: filters.query, status: [InfluencerStatus.ONBOARDED] },
      },
    });
  }, [executeAuctionsSearch, filters]);

  setPageTitle('Influencers page');

  const sortOptions = [
    { value: 'ONBOARDED_AT_ASC', label: 'Newest' },
    { value: 'ONBOARDED_AT_DESC', label: 'Latest' },
    { value: 'NAME_ASC', label: 'Name: A - Z' },
    { value: 'NAME_DESC', label: 'Name: Z - A' },
    { value: 'TOTALRAISEDAMOUNT_ASC', label: 'Raised: Low to high' },
    { value: 'TOTALRAISEDAMOUNT_DESC', label: 'Raised: High to low' },
  ];
  const filterComponent = <Filters changeFilters={changeFilters} />;
  return (
    <AllItemsLayout
      changeFilters={changeFilters}
      filters={filterComponent}
      size={influencersData?.size}
      skip={influencersData?.skip}
      sortOptions={sortOptions}
      totalItems={influencersData?.totalItems}
    >
      {(influencersData?.items || []).map((infuencer: InfluencerProfile) => (
        <ItemCard key={infuencer.id} horizontal item={infuencer} />
      ))}
    </AllItemsLayout>
  );
};

export default InfluencersPage;
