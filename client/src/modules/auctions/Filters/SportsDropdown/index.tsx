import { FC, useCallback } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Form, NavDropdown } from 'react-bootstrap';

import { SportsQuery } from 'src/apollo/queries/auctions';

import styles from './styles.module.scss';

interface Props {
  selectedSports: string[];
  changeFilters: (key: string, value: any) => void;
}

const SportsDropdown: FC<Props> = ({ selectedSports, changeFilters }) => {
  const { data: sportsListData } = useQuery(SportsQuery);

  const selectSport = useCallback(
    (sport: string) => {
      changeFilters('sports', [sport]);
    },
    [changeFilters],
  );

  const sportsInput = (
    <>
      <Form.Control
        readOnly
        className={clsx(styles.sportsInput, 'd-inline-block')}
        value={selectedSports[0] || 'All'}
      />
      <div className={styles.inputBtn} />
    </>
  );

  return (
    <Form.Group className={styles.dropdownFormGroup}>
      <Form.Label>Sport</Form.Label>
      <NavDropdown bsPrefix={styles.toggle} className={styles.dropdown} id="sportsListDropdown" title={sportsInput}>
        <NavDropdown.Item key={'all'} onClick={() => changeFilters('sports', [])}>
          All
        </NavDropdown.Item>
        {(sportsListData?.sports || []).map((sport: string) => (
          <NavDropdown.Item key={sport} onClick={() => selectSport(sport)}>
            {sport}
          </NavDropdown.Item>
        ))}
      </NavDropdown>
    </Form.Group>
  );
};

export default SportsDropdown;
