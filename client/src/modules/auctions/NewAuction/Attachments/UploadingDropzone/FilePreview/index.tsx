import { FC, SetStateAction, ReactElement, useCallback } from 'react';

import clsx from 'clsx';
import { Button, Image } from 'react-bootstrap';

import DeleteIcon from 'src/assets/images/delete.svg';

import styles from './styles.module.scss';

interface Props {
  file: File;
  fileForCover: number;
  index: number;
  setFiles: (_: SetStateAction<File[]>) => void;
  setFileForCover: (_: SetStateAction<number>) => void;
  disabled?: boolean;
}

const FilePreview: FC<Props> = ({ file, fileForCover, index, setFiles, setFileForCover, disabled }): ReactElement => {
  const type = file.type.split('/')[0];
  const src = URL.createObjectURL(file);

  const onDelete = useCallback(() => {
    setFiles((prevState) => prevState.filter((value, i) => index !== i));
  }, [setFiles, index]);
  const onSelect = useCallback(() => {
    if (!disabled) setFileForCover(index);
  }, [disabled, setFileForCover, index]);

  const isForCover = index === fileForCover;

  return (
    <div className={clsx(styles.wrapper, 'd-flex flex-column')}>
      <div
        className={clsx(styles.previewWrapper, isForCover && styles.forCover, disabled && 'pe-none', 'd-inline-block')}
        onClick={onSelect}
      >
        {type === 'image' ? (
          <Image alt={file.name} className={clsx(styles.preview, styles.content, 'user-select-none')} src={src} />
        ) : (
          <video
            muted
            autoPlay={false}
            className={clsx(styles.preview, styles.content)}
            src={src}
            onClick={(e) => e.preventDefault()}
          />
        )}
        {!disabled && (
          <Button className={clsx(styles.deleteBtn, 'p-0 position-absolute')} title="delete" onClick={onDelete}>
            <Image src={DeleteIcon} />
          </Button>
        )}
      </div>
      {isForCover && <div className={clsx(styles.cover, 'text-body-new')}>Cover</div>}
    </div>
  );
};

export default FilePreview;
