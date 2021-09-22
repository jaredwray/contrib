import { FC, useState, useCallback, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';

import { CharitiesListQuery } from 'src/apollo/queries/charities';
import ItemCard from 'src/components/ItemCard';
import AllItemsLayout from 'src/components/layouts/AllItemsLayout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { Charity } from 'src/types/Charity';

import Filters from './Filters';

const PER_PAGE = 20;

const CharitiesPage: FC = () => {
  const [filters, setFilters] = useState({
    query: '',
    orderBy: 'ACTIVATED_AT_ASC',
    skip: 0,
  });

  const [executeAuctionsSearch, { data }] = useLazyQuery(CharitiesListQuery);

  const charitiesData = data?.charitiesList;
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

  setPageTitle('Charities page');

  const sortOptions = [
    { value: 'ACTIVATED_AT_ASC', label: 'Newest' },
    { value: 'ACTIVATED_AT_DESC', label: 'Oldest' },
    { value: 'NAME_ASC', label: 'Name: A - Z' },
    { value: 'NAME_DESC', label: 'Name: Z - A' },
  ];
  const filterComponent = <Filters changeFilters={changeFilters} />;
  return (
    <AllItemsLayout
      changeFilters={changeFilters}
      filters={filterComponent}
      size={charitiesData?.size}
      skip={charitiesData?.skip}
      sortOptions={sortOptions}
      totalItems={charitiesData?.totalItems}
    >
      {(charitiesData?.items || []).map((charity: Charity) => (
        <ItemCard key={charity.id} horizontal isCharity={true} item={charity} />
      ))}
    </AllItemsLayout>
  );
};

export default CharitiesPage;
