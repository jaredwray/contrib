import { FC, useCallback } from 'react';

import clsx from 'clsx';
import { Form, NavDropdown } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  orderBy: string;
  changeFilters: (key: string, value: any) => void;
}

enum SortByEnum {
  createdAtDesc = 'New first',
  timeAsc = 'Ending soon first',
  sport = 'Sport',
  priceAsc = 'Price: lowest first',
  priceDesc = 'Price: highest first',
}

const SortByInput: FC<Props> = ({ orderBy, changeFilters }) => {
  const selectSortBy = useCallback(
    (orderBy: string | null) => {
      changeFilters('orderBy', orderBy);
    },
    [changeFilters],
  );

  const sortByInput = (
    <>
      <Form.Control
        readOnly
        className={clsx(styles.sortByInput, 'd-inline-block')}
        value={SortByEnum[orderBy as keyof typeof SortByEnum]}
      />
      <div className={styles.inputBtn} />
    </>
  );

  return (
    <div className={clsx('float-left float-sm-right pt-4 pt-sm-0 form-inline h-100', styles.dropdownWrapper)}>
      <Form.Group className={styles.dropdownFormGroup}>
        <Form.Label className="pr-3">Sort by</Form.Label>
        <NavDropdown bsPrefix={styles.toggle} className={styles.dropdown} id="sortsListDropdown" title={sortByInput}>
          {Object.entries(SortByEnum).map((item: string[]) => (
            <NavDropdown.Item key={item[0]} onClick={() => selectSortBy(item[0])}>
              {item[1]}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      </Form.Group>
    </div>
  );
};

export default SortByInput;
