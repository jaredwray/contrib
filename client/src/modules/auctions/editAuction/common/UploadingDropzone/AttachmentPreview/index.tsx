import { FC, useState, useCallback, ReactElement, SetStateAction } from 'react';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';

import { DeleteAuctionMediaMutation } from 'src/apollo/queries/auctions';
import VideoIcon from 'src/assets/icons/VideoIcon';
import { CloseButton } from 'src/components/buttons/CloseButton';
import { AuctionAttachment } from 'src/types/Auction';

import AttachmentsStateInterface from '../common/AttachmentsStateInterface';
import previewStyles from '../common/preview.module.scss';

interface Props {
  auctionId: string;
  attachment: AuctionAttachment;
  setAttachments: (_: SetStateAction<AttachmentsStateInterface>) => void;
  setErrorMessage: (_: SetStateAction<string>) => void;
  setSelectedAttachment: (_: SetStateAction<AuctionAttachment | null>) => void;
}

const AttachementPreview: FC<Props> = ({
  auctionId,
  attachment,
  setAttachments,
  setErrorMessage,
  setSelectedAttachment,
}): ReactElement => {
  const [isInvalidPicture, setIsInvalidPicture] = useState(false);
  const [removeAuctionMedia] = useMutation(DeleteAuctionMediaMutation, {
    onError(error) {
      setErrorMessage('Something happened while deleting your file. Please, try later.');
    },
  });

  const removeMedia = useCallback(
    (attachment: AuctionAttachment) => {
      setAttachments((prevState: AttachmentsStateInterface) => {
        return {
          ...prevState,
          uploaded: prevState.uploaded.filter((uploaded: AuctionAttachment) => uploaded.url !== attachment.url),
          loading: prevState.loading,
        };
      });

      removeAuctionMedia({
        variables: { id: auctionId, url: attachment.url },
      });
    },
    [auctionId, removeAuctionMedia, setAttachments],
  );

  const handleMediaRemove = useCallback(() => removeMedia(attachment), [attachment, removeMedia]);
  const onClickPreview = useCallback(() => setSelectedAttachment(attachment), [attachment, setSelectedAttachment]);
  const onImagePreviewError = useCallback(() => setIsInvalidPicture(true), [setIsInvalidPicture]);
  const srcUrl = attachment.thumbnail || attachment.url;

  return (
    <div className={previewStyles.previewWrapper}>
      <div className={(clsx(previewStyles.attachmentContent), 'd-flex clickable h-100 w-100')} onClick={onClickPreview}>
        {isInvalidPicture ? (
          <VideoIcon className="w-100 h-100 pr-2" hideAddSign={true} />
        ) : (
          <img alt="" className={previewStyles.preview} src={srcUrl} onError={onImagePreviewError} />
        )}
      </div>
      <CloseButton action={handleMediaRemove} />
    </div>
  );
};

export default AttachementPreview;
