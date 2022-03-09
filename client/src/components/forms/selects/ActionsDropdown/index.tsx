import { FC } from 'react';

import { DropdownButton } from 'react-bootstrap';

interface Props {
  children?: React.ReactNode;
}

export const ActionsDropdown: FC<Props> = ({ children }) => {
  return (
    <DropdownButton align="end" className="dropdown-actions" id="itemActions" title="..." variant="link">
      {children}
    </DropdownButton>
  );
};
