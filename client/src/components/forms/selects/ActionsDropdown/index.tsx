import { FC } from 'react';

import { DropdownButton } from 'react-bootstrap';

interface Props {
  children?: React.ReactNode;
}

export const ActionsDropdown: FC<Props> = ({ children }) => {
  return (
    <DropdownButton className="dropdown-actions" id="itemActions" align="end" title="..." variant="link">
      {children}
    </DropdownButton>
  );
};
