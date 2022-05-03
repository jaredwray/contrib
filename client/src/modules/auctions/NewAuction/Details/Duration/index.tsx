import { FC, useCallback } from 'react';

import Select from 'src/components/forms/selects/Select';

import './select.scss';

const VALUES = [1, 2, 3, 5, 8];
const DEFAULT_VALUE = 3;

interface Props {
  disabled?: boolean;
}

const Duration: FC<Props> = ({ disabled }: Props) => {
  const option = useCallback((value: number) => {
    return { value: value.toString(), label: `${value} day${value > 1 ? 's' : ''}` };
  }, []);
  const options = VALUES.map((i) => option(i));

  return (
    <div className="py-4">
      <Select
        required
        className="duration-select"
        disabled={disabled}
        name="duration"
        options={options}
        selected={option(DEFAULT_VALUE)}
        titlePrefix="Run Time: "
        onChange={() => {}}
      />
      <div className="text-label-light">Select how many days your auction will be live for</div>
    </div>
  );
};

export default Duration;
