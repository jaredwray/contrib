import { FC } from 'react';

import styles from './styles.module.scss';

interface Props {
  src: string;
}

export const ProfileAvatar: FC<Props> = ({ src }) => (
  <div
    className={styles.avatar}
    style={{
      background: `no-repeat center url(${src})`,
      backgroundSize: 'cover',
    }}
  ></div>
);
