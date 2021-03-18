import { FC, ReactElement, useState, useCallback } from 'react';

import { Image } from 'react-bootstrap';

import AddPhotoIcon from 'src/assets/images/ProtoIcon';
import AddVideoIcon from 'src/assets/images/VideoIcon';
import { AuctionAttachment } from 'src/types/Auction';

interface Props {
  attachment: AuctionAttachment;
  className: string;
}

const AttachmentThumbnail: FC<Props> = ({ attachment, className }): ReactElement => {
  const [isInvalidPicture, setIsInvalidPicture] = useState(false);

  const srcUrl = attachment.thumbnail || attachment.url;
  const onImagePreviewError = useCallback(() => setIsInvalidPicture(true), [setIsInvalidPicture]);
  const defaultPicture =
    attachment.type === 'VIDEO' ? <AddVideoIcon hideAddSign={true} /> : <AddPhotoIcon hideAddSign={true} />;

  if (isInvalidPicture) {
    return defaultPicture;
  }

  return <Image className={className} src={srcUrl} onError={onImagePreviewError} />;
};

export default AttachmentThumbnail;
