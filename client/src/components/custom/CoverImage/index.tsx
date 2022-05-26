import { FC } from 'react';

import clsx from 'clsx';

import resizedImageUrl from 'src/helpers/resizedImageUrl';

import styles from './styles.module.scss';

type Props = {
  src: string | null;
  formatSize: number;
  alt: string;
  className?: string;
};

const CoverImage: FC<Props> = ({ src, alt, formatSize, className }) => {
  return (
    <div className={clsx(styles.root, className)}>
      {src && (
        <img
          alt={alt}
          className={styles.image}
          src={resizedImageUrl(src || '', formatSize)}
          onError={(event) => {
            (event.target as HTMLImageElement).src = '/content/img/default-auction-preview.webp';
          }}
        />
      )}
    </div>
  );
};

export default CoverImage;
