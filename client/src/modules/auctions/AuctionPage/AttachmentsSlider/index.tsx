import { FC, ReactElement, MouseEvent, useCallback, useState, useRef } from 'react';

import { HTMLStreamElement, Stream } from '@cloudflare/stream-react';
import clsx from 'clsx';
import { Image } from 'react-bootstrap';
import Slider from 'react-slick';

import AttachmentThumbnail from 'src/components/customComponents/AttachmentThumbnail';
import AttachmentModal from 'src/components/modals/AttachmentModal';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { AuctionAttachment } from 'src/types/Auction';

import 'slick-carousel/slick/slick.css';
import styles from './styles.module.scss';

interface Props {
  attachments: AuctionAttachment[];
}

const AttachmentsSlider: FC<Props> = ({ attachments }): ReactElement | null => {
  const state = useRef({ x: 0 });
  const [attachmentToDisplay, setAttachmentToDisplay] = useState<AuctionAttachment | null>(null);
  const [activeStream, setActiveStream] = useState<HTMLStreamElement>();

  const handleAttachmentClick = useCallback(
    (e: MouseEvent, attachment: AuctionAttachment) => {
      if (e.screenX !== state.current.x) return e.preventDefault();
      if (attachment.type === 'IMAGE') setAttachmentToDisplay(attachment);
    },
    [setAttachmentToDisplay],
  );

  const desktopPaging = (i: number) => (
    <div key={i}>
      <AttachmentThumbnail key={i} attachment={attachments[i]} className={styles.attachmentThumbnail} />
    </div>
  );
  const mobilePaging = (i: number) => <div key={i} />;

  const settings = {
    arrows: false,
    dots: true,
    className: clsx(styles.slider, 'auction-attachments-slider text-center'),
    customPaging: desktopPaging,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: () => activeStream?.pause(),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: true,
          customPaging: mobilePaging,
        },
      },
    ],
  };

  const onStreamPlay = useCallback(
    (e: any) => {
      setActiveStream(e.target);
    },
    [setActiveStream],
  );

  if (attachments.length === 0) return null;

  return (
    <>
      <AttachmentModal attachment={attachmentToDisplay} closeModal={() => setAttachmentToDisplay(null)} />
      <Slider {...settings}>
        {attachments.map((attachment, i) => (
          <div
            key={i}
            className={styles.attachmentImageWrapper}
            data-test-id="attachment-id"
            onClick={(e: MouseEvent) => handleAttachmentClick(e, attachment)}
            onMouseDown={(e: MouseEvent) => (state.current.x = e.screenX)}
          >
            {attachment.type === 'IMAGE' ? (
              <Image className={styles.attachment} src={ResizedImageUrl(attachment.url, 720)} />
            ) : (
              <Stream controls height="min(540px, 100vw)" src={attachment.uid} onPlay={onStreamPlay} />
            )}
          </div>
        ))}
      </Slider>
    </>
  );
};

export default AttachmentsSlider;
