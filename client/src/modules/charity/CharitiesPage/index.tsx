import { FC, useState, useCallback, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';

import { CharitiesListQuery } from 'src/apollo/queries/charities';
import { AllItemsLayout, PER_PAGE } from 'src/components/layouts/AllItemsLayout';
import ItemCard from 'src/components/layouts/AllItemsLayout/ItemCard';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { Charity, CharityStatus } from 'src/types/Charity';

import Filters from './Filters';

const CharitiesPage: FC = () => {
  const sortOptions = [
    { value: 'ACTIVATED_AT_ASC', label: 'Newest' },
    { value: 'ACTIVATED_AT_DESC', label: 'Latest' },
    { value: 'NAME_ASC', label: 'Name: A - Z' },
    { value: 'NAME_DESC', label: 'Name: Z - A' },
    { value: 'TOTALRAISEDAMOUNT_ASC', label: 'Raised: Low to high' },
    { value: 'TOTALRAISEDAMOUNT_DESC', label: 'Raised: High to low' },
  ];

  const [filters, setFilters] = useState({
    query: '',
    orderBy: 'ACTIVATED_AT_ASC',
    pageSkip: 0,
  });

  const [executeAuctionsSearch, { data: charitiesListData }] = useLazyQuery(CharitiesListQuery);
  const changeFilters = useCallback((key: string, value: any) => {
    setFilters((prevState: any) => {
      return { ...prevState, pageSkip: 0, [key]: value };
    });
  }, []);

  const charities = charitiesListData?.charitiesList;

  useEffect(() => {
    executeAuctionsSearch({
      variables: {
        size: PER_PAGE,
        skip: filters.pageSkip,
        orderBy: filters.orderBy,
        filters: { query: filters.query, status: [CharityStatus.ACTIVE] },
      },
    });
  }, [executeAuctionsSearch, filters]);

  setPageTitle('Charities page');

  return (
    <AllItemsLayout
      changeFilters={changeFilters}
      filters={<Filters changeFilters={changeFilters} />}
      size={charities?.size}
      skip={charities?.skip}
      sortOptions={sortOptions}
      totalItems={charities?.totalItems}
    >
      {(charities?.items || []).map((charity: Charity) => (
        <ItemCard
          key={charity.id}
          horizontal
          isCharity={true}
          item={charity}
          path={`/charity/${charity.semanticId || charity.id}`}
        />
      ))}
    </AllItemsLayout>
  );
};

export default CharitiesPage;
