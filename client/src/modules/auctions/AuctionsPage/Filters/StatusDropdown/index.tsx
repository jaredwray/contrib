import { FC, useCallback, useMemo } from 'react';

import { Form } from 'react-bootstrap';

import Select from 'src/components/Select';
import { AuctionStatus } from 'src/types/Auction';

interface Props {
  selectedStatuses: string[];
  changeFilters: (key: string, value: any) => void;
}

const StatusDropdown: FC<Props> = ({ selectedStatuses, changeFilters }) => {
  const statusesAll = useMemo(() => {
    return [AuctionStatus.ACTIVE, AuctionStatus.SETTLED, AuctionStatus.SOLD, AuctionStatus.PENDING];
  }, []);
  const statusesPast = useMemo(() => {
    return [AuctionStatus.SOLD, AuctionStatus.SETTLED];
  }, []);

  const options = useMemo(() => {
    return [
      { label: 'All', value: 'All' },
      { label: 'Active', value: AuctionStatus.ACTIVE },
      { label: 'Ended', value: 'Past' },
    ];
  }, []);

  const selectStatus = useCallback(
    (status: string) => {
      if (status === options[0].label) {
        changeFilters('status', statusesAll);
      } else if (status === options[2].value) {
        changeFilters('status', statusesPast);
      } else {
        changeFilters('status', [status]);
      }
    },
    [changeFilters, statusesAll, statusesPast, options],
  );

  const hasSelection = selectedStatuses.length;

  return (
    <Form.Group className="mb-1">
      <Form.Label>Status</Form.Label>
      <Select
        options={options}
        placeholder="Select status"
        selected={hasSelection ? selectedStatuses : options[0]}
        onChange={selectStatus}
      />
    </Form.Group>
  );
};

export default StatusDropdown;
