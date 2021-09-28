import { FC, useCallback } from 'react';

import clsx from 'clsx';

import SearchInput from 'src/components/inputs/SearchInput';

import styles from './styles.module.scss';

interface Props {
  changeFilters: (key: string, value: string) => void;
}

const Filters: FC<Props> = ({ changeFilters }) => {
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
      <div className={clsx('float-left pt-4 pb-4', styles.title)}>Charities</div>
      <SearchInput className="mb-1" placeholder="Search" onCancel={handleQueryCancel} onChange={handleQueryChange} />
    </>
  );
};

export default Filters;
