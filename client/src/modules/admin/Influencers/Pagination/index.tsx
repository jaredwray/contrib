import clsx from 'clsx';
import { Button, Spinner } from 'react-bootstrap';

import styles from './styles.module.scss';

export const PER_PAGE = 25;

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
    <div className="float-left h-100 d-flex">
      <Button
        className={clsx(styles['pagination-btn'], 'text-label pagination-btn-prev')}
        disabled={!hasPev}
        variant=""
        onClick={props.showPrevPage}
      />
      <Button
        className={clsx(styles['pagination-btn'], styles['pagination-btn-next'], ' ml-3 mr-2')}
        disabled={!hasNext}
        variant=""
        onClick={props.showNextPage}
      />

      {props.loading ? (
        <Spinner animation="border" className="m-auto" />
      ) : (
        <div className={clsx(styles['pagination-status'], 'ml-3')}>
          <span className="pagination-status-current">
            {props.skip + 1} - {itemsOnPage}
          </span>
          <span className={clsx(styles['pagination-status-info'], 'ml-2 ')}>of {props.total}</span>
        </div>
      )}
    </div>
  );
}
