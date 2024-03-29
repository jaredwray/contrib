import React, { FC } from 'react';

import VerifiedIcon from 'src/assets/icons/VerifiedIcon';

import styles from './styles.module.scss';

const VerifiedStatus: FC = () => (
  <div className="text-label d-flex align-items-center mb-2">
    <VerifiedIcon className="me-2" />
    <span className={styles.root}>Verified Athlete</span>
  </div>
);

export default VerifiedStatus;
