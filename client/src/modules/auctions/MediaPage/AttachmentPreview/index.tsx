import { FC, useCallback, ReactElement } from 'react';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Image } from 'react-bootstrap';

import { RemoveAuctionMedia } from 'src/apollo/queries/auctions';
import { AuctionAttachment } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  auctionId: string;
  attachment: AuctionAttachment;
  file?: File;
  assignAttachments: (array: AuctionAttachment[]) => void;
}

const AttachementPreview: FC<Props> = ({ auctionId, attachment, file, assignAttachments }): ReactElement => {
  const [removeAuctionMedia] = useMutation(RemoveAuctionMedia, {
    onError(error) {
      // TODO: show error
      console.log(error);
    },
    onCompleted(data: any) {
      assignAttachments(data.removeAuctionAttachment.attachments);
    },
  });

  const removeMedia = useCallback(
    (url: string) => {
      removeAuctionMedia({
        variables: { id: auctionId, url },
      });
    },
    [auctionId, removeAuctionMedia],
  );

  const handleMediaRemove = useCallback(() => removeMedia(attachment.url), [attachment.url, removeMedia]);

  const srcUrl = attachment.type === 'IMAGE' ? attachment.url : attachment.thumbnail;

  return (
    <div className={clsx(styles.previewWrapper, 'd-inline-block')}>
      <a href={attachment.url} rel="noreferrer noopener" target="_blank">
        <Image className={styles.imagePreview} src={srcUrl} />
      </a>
      {attachment && (
        <span className={styles.mediaDeleteBnt} title="delete" onClick={handleMediaRemove}>
          x
        </span>
      )}
    </div>
  );
};

export default AttachementPreview;
