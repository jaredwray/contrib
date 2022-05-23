import { FC, useCallback } from 'react';

import clsx from 'clsx';
import { Button } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router';

import { useUrlQueryParams } from 'src/helpers/useUrlQueryParams';

import styles from './styles.module.scss';

export const PER_PAGE = 20;

interface Props {
  loading: boolean;
  total: number;
  setPageSkip: (x: number) => void;
}

const Pagination: FC<Props> = ({ loading, total, setPageSkip }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const query = useUrlQueryParams().get('q');
  const page = Number(useUrlQueryParams().get('p'));
  const baseurl = `${pathname}?${query ? `q=${query}&` : ''}p=`;

  const skip = page * PER_PAGE;
  const hasPev = skip > 0;
  const hasNext = total > PER_PAGE + skip;
  const itemsOnPage = hasNext ? PER_PAGE + skip : total;

  const showPrevPage = useCallback(() => {
    setPageSkip(skip - PER_PAGE);
    history.push(`${baseurl}${page - 1}`);
  }, [setPageSkip, history, baseurl, page, skip]);
  const showNextPage = useCallback(() => {
    setPageSkip(skip + PER_PAGE);
    history.push(`${baseurl}${page ? page + 1 : 2}`);
  }, [setPageSkip, history, baseurl, page, skip]);

  return (
    <div className={clsx(styles.container, 'float-start h-100 d-flex')}>
      <Button className={clsx(styles.paginationBtn)} disabled={!hasPev} variant="" onClick={showPrevPage} />
      <Button
        className={clsx(styles.paginationBtn, styles.nextBtn, 'ms-3 me-2')}
        disabled={!hasNext}
        variant=""
        onClick={showNextPage}
      />

      {!loading && (
        <div className={clsx(styles.status, 'w-50 ms-3 ms-md-1')}>
          <span className="pagination-status-current">
            {total > 0 ? skip + 1 : 0} - {itemsOnPage}
          </span>
          <span className={clsx(styles.statusInfo, 'ms-2 ')}>of {total}</span>
        </div>
      )}
    </div>
  );
};
export default Pagination;
