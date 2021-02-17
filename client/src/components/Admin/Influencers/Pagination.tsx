import { Button, Spinner } from "react-bootstrap";

import "./Pagination.scss";

export const PER_PAGE = 2;

export default function Pagination(props: { loading: boolean, skip: number, total: number, showPrevPage: any, showNextPage: any }) {
  const hasPev = (props.skip > 0);
  const hasNext = (props.total > PER_PAGE + props.skip);
  const itemsOnPage = (hasNext ? (PER_PAGE + props.skip) : props.total);

  return (
    <div className="pagination float-left">
      <Button className="pagination-btn pagination-btn-prev" variant="" disabled={!hasPev} onClick={props.showPrevPage} />
      <Button className="pagination-btn pagination-btn-next ml-3 mr-2" variant="" disabled={!hasNext} onClick={props.showNextPage} />

      {props.loading ? <Spinner animation="border" /> :
        <div className="ml-3 pagination-status">
          <span className="pagination-status-current">{props.skip + 1} - {itemsOnPage}</span>
          <span className="ml-2 pagination-status-info">of {props.total}</span>
        </div>
      }
     </div>
  )
};
