import { FC } from 'react';

import clsx from 'clsx';

import HeartIcon from 'src/assets/images/Heart';

import AsyncButton from '../AsyncButton';
import styles from './styles.module.scss';

interface Props {
  followed?: boolean;
  loading?: boolean;
  disabled?: boolean;
  followHandler?: () => Promise<void>;
  unfollowHandler?: () => Promise<void>;
  className?: string;
}

const HeartBtn: FC<Props> = ({ loading, disabled, followed, unfollowHandler, followHandler, className }) => {
  return (
    <div className={className}>
      <AsyncButton
        className={clsx(styles.heartBtn)}
        disabled={disabled}
        loading={loading}
        variant="link"
        onClick={followed ? unfollowHandler : followHandler}
      >
        <HeartIcon followed={followed} />
      </AsyncButton>
    </div>
  );
};

export default HeartBtn;
