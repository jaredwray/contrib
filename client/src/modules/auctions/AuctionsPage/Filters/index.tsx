import { FC, useCallback, useState } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Form } from 'react-bootstrap';

import { ActiveCharitiesList } from 'src/apollo/queries/charities';
import SearchInput from 'src/components/forms/inputs/SearchInput';
import { CharitySearchSelect } from 'src/components/forms/selects/CharitySearchSelect';
import { CharityStatus } from 'src/types/Charity';

import PriceRange from './PriceRange';
import StatusDropdown from './StatusDropdown';
import styles from './styles.module.scss';

interface Props {
  initialBids: any;
  filters: any;
  changeFilters: (key: string, value: string) => void;
  charityChangeFilter: (key: string, value: string[]) => void;
}

const Filters: FC<Props> = ({ initialBids, filters, changeFilters, charityChangeFilter }) => {
  const { data: charitiesListData } = useQuery(ActiveCharitiesList, {
    variables: { filters: { status: [CharityStatus.ACTIVE] } },
  });
  const OptionAll = { label: 'All', value: 'All', id: '' };
  const [selectedOption, setselectedOption] = useState<{ value: string; label: string; id: string } | null>(OptionAll);

  const handleQueryChange = useCallback(
    (value: string) => {
      changeFilters('query', value);
    },
    [changeFilters],
  );

  const handleQueryCancel = useCallback(() => {
    changeFilters('query', '');
  }, [changeFilters]);

  const handleChange = (selectedOption: { value: string; label: string; id: string } | null) => {
    setselectedOption(selectedOption);
    charityChangeFilter('charity', selectedOption?.id ? [selectedOption.id] : []);
  };

  if (!charitiesListData) return null;

  const options = [
    OptionAll,
    ...charitiesListData.charitiesList.items.map((charity: { name: string; id: string }) => ({
      label: charity.name,
      value: charity.name,
      id: charity.id,
    })),
  ];

  return (
    <>
      <div className={clsx('float-left pt-4 pb-4', styles.title)}>Auctions</div>
      <SearchInput className="mb-1" placeholder="Search" onCancel={handleQueryCancel} onChange={handleQueryChange} />
      <Form.Group className="mb-1">
        <Form.Label>Charity</Form.Label>
        <CharitySearchSelect options={options} selectedOption={selectedOption} onChange={handleChange} />
      </Form.Group>
      <StatusDropdown changeFilters={changeFilters} selectedStatuses={filters.status} />
      <PriceRange bids={filters.bids} changeFilters={changeFilters} initialBids={initialBids} />
    </>
  );
};

export default Filters;
