import { FC, ReactElement, SetStateAction } from 'react';

import clsx from 'clsx';

import styles from './styles.module.scss';
import { UploadingDropzone, MAX_PHOTOS_NUMBER, MAX_VIDEOS_NUMBER } from './UploadingDropzone';

interface Props {
  files: File[];
  setFiles: (_: SetStateAction<File[]>) => void;
  fileForCover: number;
  setFileForCover: (_: SetStateAction<number>) => void;
  disabled?: boolean;
}

const Attachments: FC<Props> = ({ files, fileForCover, setFiles, setFileForCover, disabled }): ReactElement => {
  return (
    <div className={styles.root}>
      <div className={clsx(styles.wrapper, 'm-auto py-3')}>
        <div className={styles.title}>PHOTOS & VIDEO</div>
        <div className="text-label-light">
          {`Select up to ${MAX_PHOTOS_NUMBER} photos & ${MAX_VIDEOS_NUMBER} video`}
        </div>
        <UploadingDropzone
          disabled={disabled}
          fileForCover={fileForCover}
          files={files}
          setFileForCover={setFileForCover}
          setFiles={setFiles}
        />
      </div>
    </div>
  );
};

export default Attachments;
