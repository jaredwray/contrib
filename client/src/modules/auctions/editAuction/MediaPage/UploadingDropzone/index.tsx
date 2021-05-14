import { FC, ReactElement, SetStateAction, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { useDropzone } from 'react-dropzone';

import { AddAuctionMedia } from 'src/apollo/queries/auctions';
import { AuctionAttachment } from 'src/types/Auction';

import AttachmentsStateInterface from '../common/AttachmentsStateInterface';
import AttachmentPreview from './AttachmentPreview';
import FilePreview from './FilePreview';
import styles from './styles.module.scss';

interface Props {
  accepted: string;
  attachmentsType: 'videos' | 'images';
  name: string;
  auctionId: string;
  icon: ReactElement;
  attachments: { uploaded: AuctionAttachment[]; loading: File[] };
  setAttachments: (_: SetStateAction<AttachmentsStateInterface>) => void;
  setErrorMessage: (_: SetStateAction<string>) => void;
  setSelectedAttachment: (_: SetStateAction<AuctionAttachment | null>) => void;
}

const UploadingDropzone: FC<Props> = ({
  accepted,
  name,
  attachmentsType,
  icon,
  auctionId,
  attachments,
  setAttachments,
  setErrorMessage,
  setSelectedAttachment,
}): ReactElement => {
  const [addAuctionMedia] = useMutation(AddAuctionMedia, {
    onError(error) {
      setErrorMessage(`We cannot upload one of your selected file. Please, try later`);
      setAttachments((prevState: AttachmentsStateInterface) => {
        return {
          ...prevState,
          [attachmentsType]: {
            uploaded: attachments.uploaded,
            loading: [],
          },
        };
      });
    },
    onCompleted(data: any) {
      const attachment = data.addAuctionAttachment;

      setAttachments((prevState: AttachmentsStateInterface) => {
        return {
          ...prevState,
          [attachmentsType]: {
            uploaded: attachments.uploaded.concat(attachment),
            loading: attachments.loading.filter((file) => file.name !== attachment.originalFileName),
          },
        };
      });
    },
  });

  const maxSizeGB = process.env.REACT_APP_MAX_SIZE_VIDEO_GB;
  const bytes = Math.pow(1024, 3);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any) => {
      setAttachments((prevState: AttachmentsStateInterface) => {
        return {
          ...prevState,

          [attachmentsType]: {
            uploaded: attachments.uploaded,
            loading: attachments.loading.concat(acceptedFiles),
          },
        };
      });

      acceptedFiles.forEach((file) => {
        addAuctionMedia({
          variables: { id: auctionId, file },
        });
      });

      fileRejections.forEach((file: any) => {
        file.errors.forEach((err: any) => {
          if (err.code === 'file-too-large') {
            setErrorMessage(`File is too big, max size is ${maxSizeGB} GB`);
          }

          if (err.code === 'file-invalid-type') {
            setErrorMessage(`Unsupported file format. ${err.message}`);
          }
        });
      });
    },
    [addAuctionMedia, setAttachments, setErrorMessage, auctionId, attachments, attachmentsType, maxSizeGB],
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: maxSizeGB ? parseFloat(maxSizeGB) * bytes : Infinity,
    accept: accepted,
    onDrop,
  });

  return (
    <>
      <div className="pl-3 pl-md-0 pr-3 pr-md-0 text-center text-sm-left d-table-row">
        {attachments.uploaded.map((attachment: AuctionAttachment, index: number) => (
          <AttachmentPreview
            key={index}
            attachment={attachment}
            attachmentsType={attachmentsType}
            auctionId={auctionId}
            setAttachments={setAttachments}
            setErrorMessage={setErrorMessage}
            setSelectedAttachment={setSelectedAttachment}
          />
        ))}
        {attachments.loading.map((file: File, index: number) => (
          <FilePreview key={index} attachmentsType={attachmentsType} file={file} />
        ))}
      </div>
      <div {...getRootProps({ className: styles.dropzone })}>
        <input {...getInputProps()} name={name} />
        {icon}
        <p className="text-center mt-2 mb-0">
          Drag {name} here or
          <br />
          click to upload
        </p>
      </div>
    </>
  );
};

export default UploadingDropzone;
