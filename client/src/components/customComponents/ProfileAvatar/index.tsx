import { FC } from 'react';

import styles from './styles.module.scss';

interface Props {
  src: string;
}

export const ProfileAvatar: FC<Props> = ({ src }) => (
  <div
    className={styles.avatar}
    style={{
      display: 'block',
      width: '194px',
      height: '194px',
      borderRadius: '92px',
      background: '#ffffff',
      backgroundImage: `url(${src})`,
      backgroundPosition: '50% 50%',
      backgroundRepeat: 'no-repeat',
    }}
  ></div>
);
