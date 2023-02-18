import { FC, useCallback, useState } from 'react';

import clsx from 'clsx';
import { Form } from 'react-bootstrap';

import Select from 'src/components/forms/selects/Select';

import styles from './styles.module.scss';

interface Props {
  changeFilters: (key: string, value: any) => void;
  sortOptions: any;
}

const SortBy: FC<Props> = ({ changeFilters, sortOptions }) => {
  const [sortValue, setSortValue] = useState('');
  const selectSortBy = useCallback(
    (orderBy: string) => {
      setSortValue(orderBy);
      changeFilters('orderBy', orderBy);
    },
    [changeFilters],
  );
  const selectedOption = () => {
    const selected = sortOptions?.find((option: { label: string; value: string }) => option.value === sortValue);
    return selected || (sortOptions && sortOptions[0]);
  };
  return (
    <div className={clsx(styles.formGroup, 'float-start float-sm-end pt-4 pt-sm-0 form-inline')}>
      <Form.Group className={styles.dropdownFormGroup}>
        {/* <Form.Label className="text-nowrap pe-3">Sort by</Form.Label> */}
        sort by
        <Select className={styles.select} options={sortOptions} selected={selectedOption()} onChange={selectSortBy} />
      </Form.Group>
    </div>
  );
};

export default SortBy;
