import { FC, ReactElement, useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { format } from 'date-fns-tz';
import { Table, Button, Row } from 'react-bootstrap';

import { AuctionBidsQuery } from 'src/apollo/queries/bids';
import Dialog from 'src/components/modals/Dialog';
import DialogActions from 'src/components/modals/Dialog/DialogActions';
import DialogContent from 'src/components/modals/Dialog/DialogContent';
import { AuctionBid } from 'src/types/Bid';

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
    <Dialog backdrop="static" keyboard={false} open={open} title="Bids list" onClose={onClose}>
      <DialogContent className="pt-0 pb-0">
        <Row>
          <Table>
            <tbody className="fw-normal table-bordered pb-3 text-break">
              {bids.map(({ bid, createdAt }, i) => (
                <tr key={i}>
                  <td>{`$${bid?.amount / 100}`}</td>
                  <td>{format(new Date(createdAt), 'MMM dd yyyy, HH:mm')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </DialogContent>

      <DialogActions className="d-block pt-0 pt-sm-2">
        <Button className="float-end" size="sm" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BidsListModal;
