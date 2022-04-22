import { FC, ReactElement, SetStateAction, useCallback } from 'react';

import clsx from 'clsx';
import { Button, Image } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

import AddIcon from 'src/assets/images/add-attachment.svg';
import { useShowNotification } from 'src/helpers/useShowNotification';

import FilePreview from './FilePreview';
import styles from './styles.module.scss';

const ACCEPTED_FILE_FORMATS = '.mp4, .webm, .opgg, .mov, .png, .jpeg, .jpg, .webp';
const MAX_SIZE_GB = process.env.REACT_APP_MAX_SIZE_VIDEO_GB;
const BYTES = Math.pow(1024, 3);

export const MAX_PHOTOS_NUMBER = 11;
export const MAX_VIDEOS_NUMBER = 1;

interface Props {
  files: File[];
  fileForCover: number;
  setFiles: (_: SetStateAction<File[]>) => void;
  setFileForCover: (_: SetStateAction<number>) => void;
  disabled?: boolean;
}

export const UploadingDropzone: FC<Props> = ({
  files,
  fileForCover,
  setFiles,
  setFileForCover,
  disabled,
}): ReactElement => {
  const { showError, showWarning } = useShowNotification();
  const maxAttachmentsNumber = MAX_PHOTOS_NUMBER + MAX_VIDEOS_NUMBER;
  const canAdd = files.length < maxAttachmentsNumber && !disabled;

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any) => {
      if (!canAdd) {
        showWarning(`You can add ${maxAttachmentsNumber} files only`);
        return;
      }

      setFiles((prevState) => {
        let newArray = prevState.concat(acceptedFiles).slice(0, maxAttachmentsNumber);

        newArray = [
          ...new Map(
            newArray.map((item, index) => {
              const type = item.type.split('/')[0];
              const key = type === 'video' ? type : index;

              return [key, item];
            }),
          ).values(),
        ];

        return newArray;
      });

      fileRejections.forEach((file: any) => {
        file.errors.forEach((err: any) => {
          if (err.code === 'file-too-large') {
            const sizeGB = parseFloat(MAX_SIZE_GB || '');
            let quantity;

            if (sizeGB >= 1) {
              quantity = `${sizeGB} GB`;
            } else {
              quantity = `${sizeGB * 1000} MB`;
            }
            showError(`File is too big, max size is ${quantity}`);
          }

          if (err.code === 'file-invalid-type') {
            showError(`Unsupported file format. ${err.message}`);
          }
        });
      });
    },
    [canAdd, setFiles, showError, showWarning, maxAttachmentsNumber],
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: MAX_SIZE_GB ? parseFloat(MAX_SIZE_GB) * BYTES : Infinity,
    accept: ACCEPTED_FILE_FORMATS,
    onDrop,
  });

  return (
    <div className="py-2">
      <div className={clsx(styles.files, 'd-grid')}>
        {files.map((file, index) => (
          <FilePreview
            key={index}
            disabled={disabled}
            file={file}
            fileForCover={fileForCover}
            index={index}
            setFileForCover={setFileForCover}
            setFiles={setFiles}
          />
        ))}
        {canAdd && (
          <Button {...getRootProps({ className: clsx(styles.button, 'd-inline-block') })} variant="link">
            <input {...getInputProps()} name="attachment" />
            <Image src={AddIcon} />
          </Button>
        )}
      </div>
      <Button {...getRootProps({ className: clsx(styles.link, 'm-auto p-0 pt-3') })} disabled={!canAdd} variant="link">
        Add More Photos or a Video
      </Button>
    </div>
  );
};
