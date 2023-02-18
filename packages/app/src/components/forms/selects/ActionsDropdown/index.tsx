import { FC, ReactNode } from 'react';

import { DropdownButton } from 'react-bootstrap';

interface Props {
  children?: ReactNode;
  disabled?: boolean;
}

export const ActionsDropdown: FC<Props> = ({ children, disabled }) => {
  return (
    <DropdownButton
      align="end"
      className="dropdown-actions"
      disabled={disabled}
      id="itemActions"
      title="..."
      variant="link"
    >
      {children}
    </DropdownButton>
  );
};
