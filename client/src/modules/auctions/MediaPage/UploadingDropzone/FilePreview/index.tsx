import { FC, ReactElement } from 'react';

import { Spinner } from 'react-bootstrap';

import previewStyles from '../../common/preview.module.scss';
import styles from './styles.module.scss';

interface Props {
  file: File;
  attachmentsType: string;
}

const FilePreview: FC<Props> = ({ file, attachmentsType }): ReactElement => {
  const src = URL.createObjectURL(file);

  return (
    <div className={previewStyles.previewWrapper}>
      {attachmentsType === 'images' ? (
        <img alt="" className={previewStyles.preview} src={src} />
      ) : (
        <video muted autoPlay={false} className={previewStyles.preview} src={src} onClick={(e) => e.preventDefault()} />
      )}
      <Spinner animation="border" className={styles.spinner} title="loading" />
    </div>
  );
};

export default FilePreview;
