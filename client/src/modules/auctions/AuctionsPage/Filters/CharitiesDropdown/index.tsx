import { FC, useCallback } from 'react';

import { useQuery } from '@apollo/client';
import { Form } from 'react-bootstrap';

import { AllCharitiesQuery } from 'src/apollo/queries/charities';
import Select from 'src/components/Select';
import { Charity, CharityStatus } from 'src/types/Charity';

interface Props {
  selectedCharities: string[];
  changeFilters: (key: string, value: object) => void;
}

const OptionAll = { label: 'All', value: 'All' };

const CharitiesDropdown: FC<Props> = ({ selectedCharities, changeFilters }) => {
  const { data: charityListData } = useQuery(AllCharitiesQuery, {
    variables: { size: 0, skip: 0, status: [CharityStatus.ACTIVE] },
  });

  const selectCharity = useCallback(
    (charity: string) => {
      charity === OptionAll.label ? changeFilters('charity', []) : changeFilters('charity', [charity]);
    },
    [changeFilters],
  );
  if (!charityListData) {
    return null;
  }
  const { items } = charityListData.charities;

  const options = [
    OptionAll,
    ...items.map((charity: Charity) => {
      return { value: charity.id, label: charity.name };
    }),
  ];

  const hasSelection = selectedCharities.length;

  return (
    <Form.Group className="mb-1">
      <Form.Label>Charity</Form.Label>
      <Select
        options={options}
        placeholder="Select charity"
        selected={hasSelection ? selectedCharities : OptionAll}
        onChange={selectCharity}
      />
    </Form.Group>
  );
};

export default CharitiesDropdown;
