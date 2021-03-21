import { FC } from 'react';

import clsx from 'clsx';
import { Button } from 'react-bootstrap';

import HeartIcon from 'src/assets/images/Heart';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  auction: Auction;
}

const WatchBtn: FC<Props> = ({ auction }) => {
  return (
    <div className={clsx(styles.container, 'mt-3 pt-3 pb-3 d-table  align-middle')}>
      <Button className={styles.watchBtn} variant="link">
        <HeartIcon />
      </Button>
      <div className="d-table-cell pl-4 align-middle">
        <div className={clsx(styles.subhead, 'text-subhead')}>Watch this auction</div>
        <div className="text-label text-all-cups">3 watchers</div>
      </div>
    </div>
  );
};

export default WatchBtn;
