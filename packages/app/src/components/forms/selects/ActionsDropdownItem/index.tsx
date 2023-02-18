import { FC } from 'react';

import AsyncButton from 'src/components/buttons/AsyncButton';

interface Props {
  text: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

const ActionsDropdownItem: FC<Props> = ({ text, onClick, disabled = false, loading = false }) => {
  return (
    <AsyncButton
      className="dropdown-item text--body"
      disabled={disabled}
      loading={loading}
      variant="link"
      onClick={onClick}
    >
      {text}
    </AsyncButton>
  );
};

export default ActionsDropdownItem;
