import { FC } from 'react';

import clsx from 'clsx';

import PriceRange from './PriceRange';
import SearchInput from './SearchInput';
import SportsDropdown from './SportsDropdown';
import styles from './styles.module.scss';

interface Props {
  initialBids: any;
  filters: any;
  changeFilters: (key: string, value: any) => void;
}

const Filters: FC<Props> = ({ initialBids, filters, changeFilters }) => {
  return (
    <>
      <div className={clsx('float-left pt-4 pb-4', styles.title)}>Auctions</div>
      <SearchInput changeFilters={changeFilters} query={filters.query} />
      <SportsDropdown changeFilters={changeFilters} selectedSports={filters.sports} />
      <PriceRange bids={filters.bids} changeFilters={changeFilters} initialBids={initialBids} />
    </>
  );
};

export default Filters;
