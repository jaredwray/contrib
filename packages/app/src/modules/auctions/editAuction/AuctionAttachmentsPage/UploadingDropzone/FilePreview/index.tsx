import { FC, ReactElement } from 'react';

import clsx from 'clsx';
import { Spinner } from 'react-bootstrap';

import previewStyles from '../common/preview.module.scss';
import styles from './styles.module.scss';

interface Props {
  file: File;
}

const FilePreview: FC<Props> = ({ file }): ReactElement => {
  const type = file.type.split('/')[0];
  const src = URL.createObjectURL(file);

  return (
    <div className={previewStyles.previewWrapper}>
      {type === 'image' ? (
        <img alt="" className={clsx(previewStyles.preview, previewStyles.attachmentContent)} src={src} />
      ) : (
        <video
          muted
          autoPlay={false}
          className={clsx(previewStyles.preview, previewStyles.attachmentContent)}
          src={src}
          onClick={(e) => e.preventDefault()}
        />
      )}
      <Spinner animation="border" className={styles.spinner} title="loading" />
    </div>
  );
};

export default FilePreview;
