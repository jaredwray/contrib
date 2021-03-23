import { FC, useCallback } from 'react';

import { useQuery } from '@apollo/client';
import { Form } from 'react-bootstrap';

import { SportsQuery } from 'src/apollo/queries/auctions';
import Select from 'src/components/Select';

interface Props {
  selectedSports: string[];
  changeFilters: (key: string, value: any) => void;
}

const OptionAll = 'All';

const SportsDropdown: FC<Props> = ({ selectedSports, changeFilters }) => {
  const { data: sportsListData } = useQuery(SportsQuery);

  const selectSport = useCallback(
    (sport: string) => {
      sport === OptionAll ? changeFilters('sports', []) : changeFilters('sports', [sport]);
    },
    [changeFilters],
  );

  const hasSelection = selectedSports.length;

  const options = sportsListData && [OptionAll, ...sportsListData?.sports];
  return (
    <Form.Group className="mb-1">
      <Form.Label>Sport</Form.Label>
      <Select
        options={options}
        placeholder="Select sport"
        selected={hasSelection ? selectedSports : OptionAll}
        onChange={selectSport}
      />
    </Form.Group>
  );
};

export default SportsDropdown;
