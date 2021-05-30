import { FC } from 'react';

import clsx from 'clsx';
import { Dropdown } from 'react-bootstrap';

import styles from './styles.module.scss';

const AdminDropdown: FC = ({ children }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle className={clsx(styles.editBtn, 'text-label')} id="dropdown-basic" variant="success">
        Actions
      </Dropdown.Toggle>
      <Dropdown.Menu className={clsx(styles.dropdownMenu)}>{children}</Dropdown.Menu>
    </Dropdown>
  );
};

export default AdminDropdown;
