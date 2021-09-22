import { FC, useState, useCallback, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';

import { InfluencersListQuery } from 'src/apollo/queries/influencers';
import ItemCard from 'src/components/ItemCard';
import AllItemsLayout from 'src/components/layouts/AllItemsLayout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import Filters from './Filters';

const PER_PAGE = 20;

const InfluencersPage: FC = () => {
  const [filters, setFilters] = useState({
    query: '',
    orderBy: 'ONBOARDED_AT_ASC',
    skip: 0,
  });

  const [executeAuctionsSearch, { data }] = useLazyQuery(InfluencersListQuery);

  const influencersData = data?.influencersList;
  const changeFilters = useCallback((key: string, value: any) => {
    setFilters((prevState: any) => {
      return { ...prevState, skip: 0, [key]: value };
    });
  }, []);

  useEffect(() => {
    executeAuctionsSearch({
      variables: {
        size: PER_PAGE,
        skip: filters.skip,
        orderBy: filters.orderBy,
        filters: { query: filters.query },
      },
    });
  }, [executeAuctionsSearch, filters]);

  setPageTitle('Influencers page');

  const sortOptions = [
    { value: 'ONBOARDED_AT_ASC', label: 'Newest' },
    { value: 'ONBOARDED_AT_DESC', label: 'Oldest' },
    { value: 'NAME_ASC', label: 'Name: A - Z' },
    { value: 'NAME_DESC', label: 'Name: Z - A' },
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
