import { FC, ReactElement } from 'react';

import clsx from 'clsx';
import { Button } from 'react-bootstrap';

import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  auction: Auction;
}

const WatchBtn: FC<Props> = ({ auction }): ReactElement => {
  return (
    <div className={clsx(styles.container, 'pt-3 pb-3 d-table  align-middle')}>
      <Button className={clsx(styles.watchBtn, 'd-table-cell align-sub')} variant="link" />
      <div className="d-table-cell pl-4 align-text-bottom align-middle">
        <div className={clsx(styles.subhead, 'text-subhead')}>Watch this auction</div>
        <div className="text-label text-all-cups">3 watchers</div>
      </div>
    </div>
  );
};

export default WatchBtn;
