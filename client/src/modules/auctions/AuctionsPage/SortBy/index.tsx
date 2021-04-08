import { FC, useCallback } from 'react';

import { Form } from 'react-bootstrap';

import Select from 'src/components/Select';

import styles from './styles.module.scss';

interface Props {
  changeFilters: (key: string, value: any) => void;
}

const sortByEnum = [
  { value: 'CREATED_AT_DESC', label: 'New first' },
  { value: 'TIME_ASC', label: 'Ending soon first' },
  { value: 'SPORT', label: 'Sport' },
  { value: 'PRICE_ASC', label: 'Price: lowest first' },
  { value: 'PRICE_DESC', label: 'Price: highest first' },
];

const SortBy: FC<Props> = ({ changeFilters }) => {
  const selectSortBy = useCallback(
    (orderBy: string) => {
      changeFilters('orderBy', orderBy);
    },
    [changeFilters],
  );

  return (
    <div className="float-left float-sm-right pt-4 pt-sm-0 form-inline h-100">
      <Form.Group className={styles.dropdownFormGroup}>
        <Form.Label className="pr-3 text-nowrap">Sort by</Form.Label>
        <Select className={styles.select} options={sortByEnum} selected={sortByEnum[0]} onChange={selectSortBy} />
      </Form.Group>
    </div>
  );
};

export default SortBy;