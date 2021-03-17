import { FC, useCallback } from 'react';

import clsx from 'clsx';
import { Form } from 'react-bootstrap';

import Select from 'src/components/Select';

import styles from './styles.module.scss';

interface Props {
  changeFilters: (key: string, value: any) => void;
}

const sortByEnum = [
  { value: 'createdAtDesc', label: 'New first' },
  { value: 'timeAsc', label: 'Ending soon first' },
  { value: 'sport', label: 'Sport' },
  { value: 'priceAsc', label: 'Price: lowest first' },
  { value: 'priceDesc', label: 'Price: highest first' },
];

const SortByInput: FC<Props> = ({ changeFilters }) => {
  const selectSortBy = useCallback(
    (orderBy: string) => {
      changeFilters('orderBy', orderBy);
    },
    [changeFilters],
  );

  return (
    <div className={clsx('float-left float-sm-right pt-4 pt-sm-0 form-inline h-100', styles.dropdownWrapper)}>
      <Form.Group className={styles.dropdownFormGroup}>
        <Form.Label className="pr-3">Sort by</Form.Label>
        <Select options={sortByEnum} onChange={selectSortBy} />
      </Form.Group>
    </div>
  );
};

export default SortByInput;
