import { FC, ReactElement, useState, useCallback } from 'react';

import { Image } from 'react-bootstrap';

import AddVideoIcon from 'src/assets/icons/VideoIcon';
import AddPhotoIcon from 'src/assets/images/PhotoIcon';
import resizedImageUrl from 'src/helpers/resizedImageUrl';
import useAuctionPreviewAttachment from 'src/modules/auctions/hooks/useAuctionPreviewAttachment';
import { AuctionAttachment } from 'src/types/Auction';

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

  return <Image className={className} src={resizedImageUrl(srcUrl, 100)} onError={onImagePreviewError} />;
};

export default AttachmentThumbnail;
