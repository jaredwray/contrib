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

const DOTS = '...';
const PAGINATION_LIMIT = 3;
const TOTAL_LIMIT = 5;

const Pagination: FC<Props> = ({ totalItems, pageSize, pageSkip, perPage, changeFilters }) => {
  const hasPev = pageSkip > 0;
  const hasNext = totalItems > perPage + pageSkip;
  const currentPage = Math.floor(pageSkip / perPage) + 1;
  const totalPages = Math.ceil(totalItems / perPage);

  const renderPageNumber = (number: number | string, index: number) =>
    typeof number === 'number' ? (
      <button
        key={index}
        className={clsx(styles.pageBtn, { [styles.activePageBnt]: number === currentPage }, 'btn-link')}
        onClick={() => goToPage(number)}
      >
        {number}
      </button>
    ) : (
      <button key={index} className={clsx(styles.pageBtn, styles.dots)}>
        {number}
      </button>
    );

  const goToPage = (number: number) => {
    changeFilters('pageSkip', (number - 1) * perPage);
  };

  if (totalPages < 2) return <div className="pt-4"></div>;

  const totalPagesArray = [
    ...Array(totalPages)
      .fill(0)
      .map((_, i) => i + 1),
  ];

  const PaginationWithDots = () => {
    if (currentPage > PAGINATION_LIMIT && currentPage <= totalPages - PAGINATION_LIMIT && totalPages > TOTAL_LIMIT) {
      return (
        <>
          {[
            totalPagesArray[0],
            DOTS,
            currentPage - 1,
            currentPage,
            currentPage + 1,
            DOTS,
            totalPagesArray[totalPages - 1],
          ].map((e: number | string, index) => renderPageNumber(e, index))}
        </>
      );
    }

    if (currentPage <= PAGINATION_LIMIT && totalPages > TOTAL_LIMIT) {
      return (
        <>
          {[...totalPagesArray.splice(0, PAGINATION_LIMIT), DOTS, totalPages].map((e: number | string, index) =>
            renderPageNumber(e, index),
          )}
        </>
      );
    }

    if (currentPage >= totalPages - PAGINATION_LIMIT && totalPages > TOTAL_LIMIT) {
      return (
        <>
          {[
            totalPagesArray[0],
            DOTS,
            ...totalPagesArray.splice(totalPages - PAGINATION_LIMIT, totalPages),
          ].map((e: number | string, index) => renderPageNumber(e, index))}
        </>
      );
    }

    return <>{totalPagesArray.map((e: number, index) => renderPageNumber(e, index))}</>;
  };

  return (
    <div className="pt-4 pb-4 text-center text-md-left d-flex mt-auto align-items-center" id="pagination">
      <Button
        className={clsx(styles.navBtn, 'ps-0 fw-bold')}
        disabled={!hasPev}
        variant="link"
        onClick={() => goToPage(currentPage - 1)}
      >
        Prev
      </Button>
      <div className="text-label d-inline-block px-1 px-sm-4">
        <PaginationWithDots />
      </div>
      <Button
        className={clsx(styles.navBtn, 'pe-0 fw-bold')}
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
