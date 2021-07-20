import { FC, ReactElement, useState, useCallback } from 'react';

import { Image } from 'react-bootstrap';

import AddVideoIcon from 'src/assets/icons/VideoIcon';
import AddPhotoIcon from 'src/assets/images/ProtoIcon';
import { AuctionAttachment } from 'src/types/Auction';

import useAuctionPreviewAttachment from '../../modules/auctions/hooks/useAuctionPreviewAttachment';

interface Props {
  attachment: AuctionAttachment;
  className: string;
}

const AttachmentThumbnail: FC<Props> = ({ attachment, className }): ReactElement => {
  const [isInvalidPicture, setIsInvalidPicture] = useState(false);
  const srcUrl = useAuctionPreviewAttachment([attachment]);
  const onImagePreviewError = useCallback(() => setIsInvalidPicture(true), [setIsInvalidPicture]);

  if (isInvalidPicture) {
    return attachment.type === 'VIDEO' ? <AddVideoIcon hideAddSign={true} /> : <AddPhotoIcon hideAddSign={true} />;
  }

  return <Image className={className} src={srcUrl} onError={onImagePreviewError} />;
};

export default AttachmentThumbnail;
