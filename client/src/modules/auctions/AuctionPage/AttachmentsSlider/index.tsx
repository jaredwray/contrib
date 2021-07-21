import { FC, ReactElement, useCallback, useState } from 'react';

import { HTMLStreamElement, Stream } from '@cloudflare/stream-react';
import clsx from 'clsx';
import { Image } from 'react-bootstrap';
import Slider from 'react-slick';

import AttachmentThumbnail from 'src/components/AttachmentThumbnail';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { AuctionAttachment } from 'src/types/Auction';

import 'slick-carousel/slick/slick.css';
import styles from './styles.module.scss';

interface Props {
  attachments: AuctionAttachment[];
}

const AttachmentsSlider: FC<Props> = ({ attachments }): ReactElement | null => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [activeStream, setActiveStream] = useState<HTMLStreamElement>();

  const customPaging = (i: number) => (
    <div key={i}>
      <AttachmentThumbnail key={i} attachment={attachments[i]} className={styles.attachmentThumbnail} />
    </div>
  );

  const afterChange = useCallback(
    (i: number) => {
      setCurrentSlide(i + 1);
    },
    [setCurrentSlide],
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
      <Slider {...settings}>
        {attachments.map((attachment, i) => (
          <div key={i} className={styles.attachmentImageWrapper}>
            {attachment.type === 'IMAGE' ? (
              <Image className={styles.attachment} src={ResizedImageUrl(attachment.url, 720)} />
            ) : (
              <Stream controls height="min(540px, 100vw)" src={attachment.uid} onPlay={onStreamPlay} />
            )}
          </div>
        ))}
      </Slider>
      <div className={clsx(styles.attachmentStatus, 'd-block d-md-none text-center text-body text-all-cups')}>
        {currentSlide} of {attachments.length}
      </div>
    </>
  );
};

export default AttachmentsSlider;
