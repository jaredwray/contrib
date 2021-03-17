import { FC, useCallback } from 'react';

import clsx from 'clsx';

import SearchInput from 'src/components/SearchInput';

import PriceRange from './PriceRange';
import SportsDropdown from './SportsDropdown';
import styles from './styles.module.scss';

interface Props {
  initialBids: any;
  filters: any;
  changeFilters: (key: string, value: any) => void;
}

const Filters: FC<Props> = ({ initialBids, filters, changeFilters }) => {
  const handleQueryChange = useCallback(
    (value: string) => {
      changeFilters('query', value);
    },
    [changeFilters],
  );

  const handleQueryCancel = useCallback(() => {
    changeFilters('query', '');
  }, [changeFilters]);

  return (
    <>
      <div className={clsx('float-left pt-4 pb-4', styles.title)}>Auctions</div>
      <SearchInput placeholder="Search" onCancel={handleQueryCancel} onChange={handleQueryChange} />
      <SportsDropdown changeFilters={changeFilters} selectedSports={filters.sports} />
      <PriceRange bids={filters.bids} changeFilters={changeFilters} initialBids={initialBids} />
    </>
  );
};

export default Filters;
