import { FC } from 'react';

import clsx from 'clsx';
import { Button } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  totalItems: number;
  pageSize: number;
  pageSkip: number;
  perPage: number;
  changeFilters: (key: string, value: any) => void;
}

const Pagination: FC<Props> = ({ totalItems, pageSize, pageSkip, perPage, changeFilters }) => {
  const hasPev = pageSkip > 0;
  const hasNext = totalItems > perPage + pageSkip;
  const currentPage = Math.floor(pageSkip / perPage) + 1;
  const totalPages = Math.ceil(totalItems / perPage);

  const renderPageNumber = (number: number) => (
    <button
      key={number}
      className={clsx(styles.pageBtn, { [styles.activePageBnt]: number === currentPage }, 'btn-link')}
      onClick={() => goToPage(number)}
    >
      {number}
    </button>
  );

  const goToPage = (number: number) => {
    changeFilters('pageSkip', (number - 1) * perPage);
  };

  if (totalPages === 0) {
    return null;
  }

  return (
    <div className="pt-4 pb-4 text-center text-md-left">
      <Button
        className={clsx(styles.navBtn, 'pl-0')}
        disabled={!hasPev}
        variant="link"
        onClick={() => goToPage(currentPage - 1)}
      >
        Prev
      </Button>
      <div className="text-label d-inline-block pl-1 pl-sm-4 pr-1 pr-sm-4">
        {[...Array(totalPages)].map((e: number, i: number) => renderPageNumber(i + 1))}
      </div>
      <Button
        className={clsx(styles.navBtn, 'pr-0')}
        disabled={!hasNext}
        variant="link"
        onClick={() => goToPage(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
