import { FC, ReactElement, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { useDropzone } from 'react-dropzone';

import { AddAuctionMedia } from 'src/apollo/queries/auctions';
import { AuctionAttachment } from 'src/types/Auction';

import AttachmentPreview from './AttachmentPreview';
import FilePreview from './FilePreview';
import styles from './styles.module.scss';

interface Props {
  accepted: string;
  attachmentsType: string;
  name: string;
  auctionId: string;
  icon: ReactElement;
  attachments: { uploaded: AuctionAttachment[]; loading: File[] };
  setAttachments: (_: any) => void;
  setErrorMessage: (_: any) => void;
  setSelectedAttachment: (_: any) => void;
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
      setErrorMessage('We cannot upload one of your selected file. Please, try later.');
      setAttachments((prevState: any) => {
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

      setAttachments((prevState: any) => {
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

  const onDrop = useCallback(
    (files: File[]) => {
      setAttachments((prevState: any) => {
        return {
          ...prevState,

          [attachmentsType]: {
            uploaded: attachments.uploaded,
            loading: attachments.loading.concat(files),
          },
        };
      });

      files.forEach((file) => {
        addAuctionMedia({
          variables: { id: auctionId, file },
        });
      });
    },
    [addAuctionMedia, setAttachments, auctionId, attachments, attachmentsType],
  );

  const { getRootProps, getInputProps } = useDropzone({
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
