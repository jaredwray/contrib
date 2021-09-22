import { FC, useCallback, useState } from 'react';

import clsx from 'clsx';
import { Form } from 'react-bootstrap';

import Select from 'src/components/Select';

import styles from './styles.module.scss';

interface Props {
  changeFilters: (key: string, value: any) => void;
  sortOptions: any;
}

const SortBy: FC<Props> = ({ changeFilters, sortOptions }) => {
  const [initialValue, setSortValue] = useState('');
  const selectSortBy = useCallback(
    (orderBy: string) => {
      setSortValue(orderBy);
      changeFilters('orderBy', orderBy);
    },
    [changeFilters],
  );
  const selectedOption = () => {
    const selected = sortOptions?.find((option: { label: string; value: string }) => option.value === initialValue);
    return selected || (sortOptions && sortOptions[0]);
  };
  return (
    <div className={clsx(styles.formGroup, 'float-left float-sm-right pt-4 pt-sm-0 form-inline h-100')}>
      <Form.Group className={styles.dropdownFormGroup}>
        <Form.Label className="pr-3 text-nowrap">Sort by</Form.Label>
        <Select className={styles.select} options={sortOptions} selected={selectedOption()} onChange={selectSortBy} />
      </Form.Group>
    </div>
  );
};

export default SortBy;
