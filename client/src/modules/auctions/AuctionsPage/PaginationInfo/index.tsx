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
    <div className={clsx(styles.paginationInfo, 'text-label float-left d-sm-table pt-3 pb-3 pt-sm-0 pb-sm-0')}>
      <span className="d-sm-table-cell align-middle">
        {itemsOnPageFromNumber}-{itemsOnPage}
      </span>
      <span className={clsx(styles.pagesCount, 'd-sm-table-cell align-middle pl-1')}>of {totalItems}</span>
    </div>
  );
};

export default PaginationInfo;
