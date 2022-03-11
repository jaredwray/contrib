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
    orderBy: 'DEFAULT',
    pageSkip: 0,
  });

  const [executeInfluencersSearch, { data }] = useLazyQuery(InfluencersListQuery);

  const influencersData = data?.influencersList;
  const changeFilters = useCallback((key: string, value: any) => {
    setFilters((prevState: any) => {
      return { ...prevState, pageSkip: 0, [key]: value };
    });
  }, []);

  useEffect(() => {
    executeInfluencersSearch({
      variables: {
        size: PER_PAGE,
        skip: filters.pageSkip,
        orderBy: filters.orderBy,
        filters: { query: filters.query, status: [InfluencerStatus.ONBOARDED] },
      },
    });
  }, [executeInfluencersSearch, filters]);

  const sortOptions = [
    { value: 'DEFAULT', label: 'Default' },
    { value: 'ONBOARDED_AT_ASC', label: 'Newest' },
    { value: 'NAME_ASC', label: 'Name: A - Z' },
    { value: 'NAME_DESC', label: 'Name: Z - A' },
  ];
  const filterComponent = <Filters changeFilters={changeFilters} />;

  setPageTitle('Influencers page');

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
        <ItemCard key={infuencer.id} horizontal item={infuencer} path={`/profiles/${infuencer.id}`} />
      ))}
    </AllItemsLayout>
  );
};

export default InfluencersPage;
