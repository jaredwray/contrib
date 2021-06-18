import { FC } from 'react';

import clsx from 'clsx';

import HeartIcon from 'src/assets/images/Heart';

import AsyncButton from '../AsyncButton';
import styles from './styles.module.scss';

interface Props {
  followed?: boolean | undefined;
  entityType: string;
  followersNumber: number | undefined;
  loading: boolean;
  disabled: boolean;
  followHandler: () => Promise<void>;
  unfollowHandler: () => Promise<void>;
}

const WatchBtn: FC<Props> = ({
  followersNumber,
  followHandler,
  unfollowHandler,
  entityType,
  followed,
  loading,
  disabled,
}) => {
  return (
    <div className={clsx(styles.container, 'mt-3 pt-3 pb-3 d-table  align-middle')}>
      <AsyncButton
        className={styles.watchBtn}
        disabled={disabled}
        loading={loading}
        variant="link"
        onClick={followed ? unfollowHandler : followHandler}
      >
        <HeartIcon followed={followed} />
      </AsyncButton>
      <div className="d-table-cell pl-4 align-middle">
        <div className={clsx(styles.subhead, 'text-subhead')}>Watch this {entityType}</div>
        <div className="text-label text-all-cups">
          {followersNumber} watcher{followersNumber !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default WatchBtn;
