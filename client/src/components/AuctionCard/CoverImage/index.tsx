import { FC, useState, useEffect, useRef } from 'react';

import clsx from 'clsx';

import ResizedImageUrl from 'src/helpers/ResizedImageUrl';

import styles from './styles.module.scss';

type Props = {
  src: string | null;
  alt: string;
  className?: string;
};

const placeholder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=';

const CoverImage: FC<Props> = ({ src, alt, className }) => {
  const imageSrc = src || placeholder;

  const [loadedImageSrc, setLoadedImageSrc] = useState(placeholder);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    let observer: IntersectionObserver;
    const element = imageRef.current!;

    if (loadedImageSrc !== imageSrc) {
      setLoadedImageSrc(placeholder);
    }

    if (element && loadedImageSrc !== imageSrc) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.intersectionRatio > 0 || entry.isIntersecting) {
                setLoadedImageSrc(imageSrc);
                observer.unobserve(element);
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: '50%',
          },
        );
        observer.observe(element);
      } else {
        setLoadedImageSrc(imageSrc);
      }
    }

    return () => {
      if (observer && observer.unobserve) {
        observer.unobserve(element);
      }
    };
  }, [src, imageSrc, imageRef, loadedImageSrc]);

  return (
    <div className={clsx(styles.root, className)}>
      <img ref={imageRef} alt={alt} className={styles.image} src={ResizedImageUrl(loadedImageSrc, 480)} />
    </div>
  );
};

export default CoverImage;
