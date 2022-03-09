import clsx from 'clsx';
import { Button } from 'react-bootstrap';

import styles from './styles.module.scss';

export const PER_PAGE = 20;

export default function Pagination(props: {
  loading: boolean;
  skip: number;
  total: number;
  showPrevPage: any;
  showNextPage: any;
}) {
  const hasPev = props.skip > 0;
  const hasNext = props.total > PER_PAGE + props.skip;
  const itemsOnPage = hasNext ? PER_PAGE + props.skip : props.total;

  return (
    <div className={clsx(styles.container, 'float-start h-100 d-flex')}>
      <Button className={clsx(styles.paginationBtn)} disabled={!hasPev} variant="" onClick={props.showPrevPage} />
      <Button
        className={clsx(styles.paginationBtn, styles.nextBtn, 'ms-3 me-2')}
        disabled={!hasNext}
        variant=""
        onClick={props.showNextPage}
      />

      {!props.loading && (
        <div className={clsx(styles.status, 'w-50 ms-3 ms-md-1')}>
          <span className="pagination-status-current">
            {props.total > 0 ? props.skip + 1 : 0} - {itemsOnPage}
          </span>
          <span className={clsx(styles.statusInfo, 'ms-2 ')}>of {props.total}</span>
        </div>
      )}
    </div>
  );
}
