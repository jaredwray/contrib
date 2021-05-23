import { FC } from 'react';

import { Stream } from '@cloudflare/stream-react';
import clsx from 'clsx';
import { Modal } from 'react-bootstrap';

import { AuctionAttachment } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  selectedAttachment: AuctionAttachment | null;
  closeModal: () => void;
}

const Dialog: FC<Props> = ({ selectedAttachment, closeModal }) => {
  if (!selectedAttachment) {
    return null;
  }

  return (
    <Modal centered contentClassName="d-table" show={true} onHide={closeModal}>
      <Modal.Body className={clsx(styles.body, 'text-center')}>
        <button className={styles.closeBtn} title="close" onClick={closeModal}>
          X
        </button>
        {selectedAttachment.type === 'VIDEO' ? (
          <Stream controls src={selectedAttachment.cloudflareUrl} />
        ) : (
          <img alt="" className={styles.image} src={selectedAttachment.url} />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Dialog;
