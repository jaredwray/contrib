import { FC, useCallback } from 'react';

import { useQuery } from '@apollo/client';
import { Form } from 'react-bootstrap';

import { SportsQuery } from 'src/apollo/queries/auctions';
import Select from 'src/components/Select';

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

  return (
    <Form.Group className={styles.dropdownFormGroup}>
      <Form.Label>Sport</Form.Label>
      <Select
        options={sportsListData?.sports}
        placeholder="Select sport"
        selected={selectedSports || 'all'}
        onChange={selectSport}
      />
    </Form.Group>
  );
};

export default SportsDropdown;
