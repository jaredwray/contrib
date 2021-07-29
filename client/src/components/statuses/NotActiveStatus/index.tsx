import React, { FC } from 'react';

import InactiveIcon from 'src/assets/icons/InactiveIcon';

import styles from './styles.module.scss';

const NotActiveStatus: FC = ({ children }) => (
  <div className="text-label d-flex align-items-center mb-2">
    <InactiveIcon className="mr-2" />
    <span className={styles.root}>{children}</span>
  </div>
);

export default NotActiveStatus;
