import { FC, useCallback } from 'react';

import { DocumentNode, useMutation } from '@apollo/client';
import clsx from 'clsx';
import { isAfter } from 'date-fns';
import { toDate, format } from 'date-fns-tz';
import { Button } from 'react-bootstrap';

import AsyncButton from 'src/components/buttons/AsyncButton';
import Form from 'src/components/forms/Form/Form';
import Dialog from 'src/components/modals/Dialog';
import DialogActions from 'src/components/modals/Dialog/DialogActions';
import DialogContent from 'src/components/modals/Dialog/DialogContent';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
  mutation: DocumentNode;
  auction: Auction;
}

export const Modal: FC<Props> = ({ open, onClose, mutation, auction }) => {
  const [SetAuctionStatusToStopped, { loading: updating }] = useMutation(mutation);
  const { title, endDate, isStopped } = auction;
  const isSettled = isAfter(new Date(), toDate(endDate));
  const readableEndDate = (endDate: string) => {
    return `${format(new Date(endDate), 'MMM dd yyyy')}`;
  };

  const onSubmit = useCallback(() => {
    SetAuctionStatusToStopped({
      variables: { id: auction?.id },
    }).then(() => window.location.reload(false));
  }, [SetAuctionStatusToStopped, auction?.id]);

  const confirmContent = () => {
    if (isSettled && isStopped) {
      return (
        <>
          <p>
            The auction <b>{title}</b> has been expired on <b>{readableEndDate(endDate)}</b>,
          </p>
          <p>
            so it will be changed to <b>SETTLED</b>.
          </p>
          <p>Change the end date before submitting if you want to make it ACTIVE</p>
        </>
      );
    }

    if (!isStopped)
      return (
        <>
          Do you want to stop an auction: <b>{title}</b>?
        </>
      );

    return (
      <>
        <p>
          Do you want to activate an auction: <b>{title}</b>?
        </p>
        <p>
          It will end on <b>{readableEndDate(endDate)}</b>
        </p>
      </>
    );
  };
  return (
    <Dialog
      className="font-weight-normal text-center"
      open={open}
      title={`Confirm ${isStopped ? 'activating' : 'stopping'}`}
      onClose={onClose}
    >
      <Form onSubmit={onSubmit}>
        <DialogContent>{confirmContent()}</DialogContent>

        <DialogActions className="justify-content-center flex-column-reverse flex-sm-row pt-0 pt-sm-2">
          <Button
            className={clsx(styles.actionBtn, 'ml-0 mr-sm-auto p-3')}
            disabled={updating}
            size="sm"
            variant="light"
            onClick={onClose}
          >
            Cancel
          </Button>
          <AsyncButton className={clsx(styles.actionBtn)} loading={updating} type="submit" variant="secondary">
            Submit
          </AsyncButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
