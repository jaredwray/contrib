import { FC, ReactElement, MouseEvent, useCallback, useState, useRef } from 'react';

import { HTMLStreamElement, Stream } from '@cloudflare/stream-react';
import clsx from 'clsx';
import { Image } from 'react-bootstrap';
import Slider from 'react-slick';

import AttachmentModal from 'src/components/AttachmentModal';
import AttachmentThumbnail from 'src/components/AttachmentThumbnail';
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
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [activeStream, setActiveStream] = useState<HTMLStreamElement>();

  const closeModal = useCallback(() => {
    setAttachmentToDisplay(null);
  }, [setAttachmentToDisplay]);

  const handleAttachmentMouseDown = useCallback(
    (e: MouseEvent) => {
      state.current.x = e.screenX;
    },
    [state],
  );

  const handleAttachmentClick = useCallback(
    (e: MouseEvent, attachment: AuctionAttachment) => {
      if (e.screenX !== state.current.x) {
        e.preventDefault();
        return;
      }
      if (attachment.type === 'IMAGE') {
        setAttachmentToDisplay(attachment);
      }
    },
    [setAttachmentToDisplay],
  );

  const customPaging = (i: number) => (
    <div key={i}>
      <AttachmentThumbnail key={i} attachment={attachments[i]} className={styles.attachmentThumbnail} />
    </div>
  );

  const afterChange = useCallback(
    (i: number) => {
      setCurrentSlideIndex(i + 1);
    },
    [setCurrentSlideIndex],
  );

  const settings = {
    arrows: true,
    className: clsx(styles.slider, 'auction-attachments-slider'),
    customPaging,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: () => activeStream?.pause(),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: false,
          arrows: true,
          afterChange,
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

  if (attachments.length === 0) {
    return null;
  }

  return (
    <>
      <AttachmentModal attachment={attachmentToDisplay} closeModal={closeModal} />
      <Slider {...settings}>
        {attachments.map((attachment, i) => (
          <div
            key={i}
            className={styles.attachmentImageWrapper}
            data-test-id="attachment-id"
            onClick={(e: MouseEvent) => handleAttachmentClick(e, attachment)}
            onMouseDown={handleAttachmentMouseDown}
          >
            {attachment.type === 'IMAGE' ? (
              <Image className={styles.attachment} src={ResizedImageUrl(attachment.url, 720)} />
            ) : (
              <Stream controls height="min(540px, 100vw)" src={attachment.uid} onPlay={onStreamPlay} />
            )}
          </div>
        ))}
      </Slider>
      <div className={clsx(styles.attachmentStatus, 'd-block d-md-none text-center text-body text-all-cups')}>
        {currentSlideIndex} of {attachments.length}
      </div>
    </>
  );
};

export default AttachmentsSlider;
