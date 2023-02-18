import { FC } from 'react';

import clsx from 'clsx';

import styles from './styles.module.scss';

interface Props {
  totalItems: number;
  pageSize: number;
  pageSkip: number;
  perPage: number;
}

const PaginationInfo: FC<Props> = ({ totalItems, pageSize, pageSkip, perPage }) => {
  const hasNext = totalItems > perPage + pageSkip;
  const itemsOnPage = hasNext ? perPage + pageSkip : totalItems;
  const itemsOnPageFromNumber = itemsOnPage === 0 ? 0 : pageSkip + 1;

  return (
    <div className={clsx(styles.paginationInfo, 'd-flex align-items-center h-100 text-label')}>
      {itemsOnPageFromNumber}-{itemsOnPage}
      <span className={clsx(styles.pagesCount, 'ps-1')}>of {totalItems}</span>
    </div>
  );
};

export default PaginationInfo;
