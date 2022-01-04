import { FC } from 'react';

import { format } from 'date-fns-tz';
import { Table } from 'react-bootstrap';

import AsyncButton from 'src/components/buttons/AsyncButton';
import { AuctionBid } from 'src/types/Bid';

import styles from './styles.module.scss';

interface Props {
  bids: AuctionBid[];
  onBidClickHandler: (b: AuctionBid) => void;
  loading: boolean;
  showProcessBtn: boolean;
}

export const Bids: FC<Props> = ({ bids, onBidClickHandler, loading, showProcessBtn }) => {
  if (bids.length === 0) return <p>no bids for this auction</p>;

  return (
    <Table className="d-block d-sl-table">
      <thead>
        <tr>
          <th>Bid</th>
          <th>Date</th>
          <th>User MongodbId</th>
          <th>User Authz0ID</th>
          <th>User Phone</th>
          {showProcessBtn && <th></th>}
        </tr>
      </thead>
      <tbody className="font-weight-normal pt-3">
        {bids.map((bid, i) => (
          <tr key={i}>
            <td className="align-middle">{bid.bid && `$${bid.bid?.amount / 100}`}</td>
            <td className="align-middle">{format(new Date(bid.createdAt), 'MMM dd yyyy HH:mm:ssXXX')}</td>
            <td className="align-middle">{bid.user.mongodbId}</td>
            <td className="align-middle">{bid.user.id}</td>
            <td className="align-middle">{bid.user.phoneNumber}</td>
            {showProcessBtn && (
              <td className="align-middle">
                <AsyncButton
                  className={styles.bidButton}
                  disabled={loading}
                  loading={loading}
                  variant="secondary"
                  onClick={() => onBidClickHandler(bid)}
                >
                  Process
                </AsyncButton>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Bids;
