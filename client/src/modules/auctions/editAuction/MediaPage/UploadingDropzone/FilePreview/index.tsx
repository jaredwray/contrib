import { FC, ReactElement } from 'react';

import { Spinner } from 'react-bootstrap';

import previewStyles from '../../common/preview.module.scss';
import styles from './styles.module.scss';

interface Props {
  file: File;
}

const FilePreview: FC<Props> = (): ReactElement => {
  return (
    <div className={previewStyles.previewWrapper}>
      <Spinner animation="border" className={styles.spinner} title="loading" />
    </div>
  );
};

export default FilePreview;
