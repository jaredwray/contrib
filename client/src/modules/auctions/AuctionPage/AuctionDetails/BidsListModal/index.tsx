import { FC, ReactElement, useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { format } from 'date-fns-tz';
import { Table, Button, Row } from 'react-bootstrap';

import { AuctionBidsQuery } from 'src/apollo/queries/bids';
import Dialog from 'src/components/modals/Dialog';
import DialogContent from 'src/components/modals/Dialog/DialogContent';
import { AuctionBid } from 'src/types/Bid';

import styles from './styles.module.scss';

interface Props {
  auctionId: string;
  open: boolean;
  totalBids: number;
  onClose: () => void;
}

const BidsListModal: FC<Props> = ({ auctionId, open, totalBids, onClose }): ReactElement => {
  const { refetch, data } = useQuery(AuctionBidsQuery, { variables: { auctionId } });
  const bids = (data?.bids || []) as AuctionBid[];

  useEffect(() => {
    if (totalBids > bids.length) refetch();
  }, [bids.length, totalBids, refetch]);

  return (
    <Dialog backdrop="static" keyboard={false} open={open} title="Bids" onClose={onClose}>
      <DialogContent className="pt-0 pb-0">
        <Row>
          <Table className={`p-0 table-striped mb-4 ${styles.bidsList}`}>
            <thead>
              <tr>
                <th>Bid Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody className="fw-normal table-bordered pb-3 text-break">
              {bids.map(({ bid, createdAt }, i) => (
                <tr key={i}>
                  <td className={'col'}>{format(new Date(createdAt), 'MMM dd yyyy, HH:mm')}</td>
                  <td className="col">{`$${bid?.amount / 100}`}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </DialogContent>
    </Dialog>
  );
};

export default BidsListModal;
