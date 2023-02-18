import { FC } from 'react';

import styles from './styles.module.scss';

interface Props {
  action: () => void;
  auctionDeleteBtn?: boolean;
}

export const CloseButton: FC<Props> = ({ action, auctionDeleteBtn }) => {
  return (
    <span
      className={auctionDeleteBtn ? styles.auctionDeleteBtn : styles.mediaDeleteBtn}
      title="delete"
      onClick={action}
    >
      x
    </span>
  );
};
