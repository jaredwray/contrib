import { FC, useCallback } from 'react';

import clsx from 'clsx';

import SearchInput from 'src/components/SearchInput';

import CharitiesDropdown from './CharitiesDropdown';
import PriceRange from './PriceRange';
import StatusDropdown from './StatusDropdown';
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
      <SearchInput className="mb-1" placeholder="Search" onCancel={handleQueryCancel} onChange={handleQueryChange} />
      <CharitiesDropdown changeFilters={changeFilters} selectedCharities={filters.charity} />
      <StatusDropdown changeFilters={changeFilters} selectedStatuses={filters.status} />
      <PriceRange bids={filters.bids} changeFilters={changeFilters} initialBids={initialBids} />
    </>
  );
};

export default Filters;
