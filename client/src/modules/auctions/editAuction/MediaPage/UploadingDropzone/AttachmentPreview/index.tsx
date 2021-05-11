import { FC, useState, useCallback, ReactElement, SetStateAction } from 'react';

import { useMutation } from '@apollo/client';

import { RemoveAuctionMedia } from 'src/apollo/queries/auctions';
import AddVideoIcon from 'src/assets/icons/VideoIcon';
import AddPhotoIcon from 'src/assets/images/ProtoIcon';
import { AuctionAttachment } from 'src/types/Auction';

import AttachmentsStateInterface from '../../common/AttachmentsStateInterface';
import previewStyles from '../../common/preview.module.scss';
import styles from './styles.module.scss';

interface Props {
  auctionId: string;
  attachment: AuctionAttachment;
  attachmentsType: 'videos' | 'images';
  setAttachments: (_: SetStateAction<AttachmentsStateInterface>) => void;
  setErrorMessage: (_: SetStateAction<string>) => void;
  setSelectedAttachment: (_: SetStateAction<AuctionAttachment | null>) => void;
}

const AttachementPreview: FC<Props> = ({
  auctionId,
  attachment,
  attachmentsType,
  setAttachments,
  setErrorMessage,
  setSelectedAttachment,
}): ReactElement => {
  const [isInvalidPicture, setIsInvalidPicture] = useState(false);
  const [removeAuctionMedia] = useMutation(RemoveAuctionMedia, {
    onError(error) {
      setErrorMessage('Something happened while deleting your file. Please, try later.');
    },
  });

  const removeMedia = useCallback(
    (attachment: AuctionAttachment) => {
      setAttachments((prevState: AttachmentsStateInterface) => {
        return {
          ...prevState,
          [attachmentsType]: {
            uploaded: prevState[attachmentsType].uploaded.filter(
              (uploaded: AuctionAttachment) => uploaded.url !== attachment.url,
            ),
            loading: prevState[attachmentsType].loading,
          },
        };
      });

      removeAuctionMedia({
        variables: { id: auctionId, url: attachment.url },
      });
    },
    [auctionId, removeAuctionMedia, setAttachments, attachmentsType],
  );

  const handleMediaRemove = useCallback(() => removeMedia(attachment), [attachment, removeMedia]);
  const onClickPreview = useCallback(() => setSelectedAttachment(attachment), [attachment, setSelectedAttachment]);
  const onImagePreviewError = useCallback(() => setIsInvalidPicture(true), [setIsInvalidPicture]);
  const srcUrl = attachment.thumbnail || attachment.url;

  const defaultPicture = () =>
    attachmentsType === 'videos' ? <AddVideoIcon hideAddSign={true} /> : <AddPhotoIcon hideAddSign={true} />;

  return (
    <div className={previewStyles.previewWrapper}>
      <div className="d-inline-block clickable" onClick={onClickPreview}>
        {isInvalidPicture ? (
          defaultPicture()
        ) : (
          <img alt="" className={previewStyles.preview} src={srcUrl} onError={onImagePreviewError} />
        )}
      </div>
      <span className={styles.mediaDeleteBnt} title="delete" onClick={handleMediaRemove}>
        x
      </span>
    </div>
  );
};

export default AttachementPreview;
