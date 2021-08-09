import { FC } from 'react';

import { Stream } from '@cloudflare/stream-react';
import clsx from 'clsx';
import { Modal, Image } from 'react-bootstrap';

import { AuctionAttachment } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  attachment: AuctionAttachment | null;
  closeModal: () => void;
}

const AttachmentModal: FC<Props> = ({ attachment, closeModal }) => {
  if (!attachment) {
    return null;
  }

  return (
    <Modal
      centered
      contentClassName={clsx(styles.content, 'd-table')}
      dialogClassName={styles.modal}
      show={true}
      onHide={closeModal}
    >
      <Modal.Body className={clsx(styles.body, 'text-center')}>
        <button className={styles.closeBtn} title="close" onClick={closeModal}>
          X
        </button>
        {attachment.type === 'VIDEO' ? (
          <Stream controls src={attachment.uid} />
        ) : (
          <Image fluid alt="" className={styles.image} src={attachment.url} />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AttachmentModal;
