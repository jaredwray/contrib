import { FC, ReactElement, SetStateAction, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import firebase from '@firebase/app';
import { useDropzone } from 'react-dropzone';
import { v4 as getUuid } from 'uuid';

import { AddAuctionMediaMutation } from 'src/apollo/queries/auctions';
import AddPhotoIcon from 'src/assets/images/ProtoIcon';
import { Auction, AuctionAttachment } from 'src/types/Auction';

import AttachmentsStateInterface from '../common/AttachmentsStateInterface';
import AttachmentPreview from './AttachmentPreview';
import FilePreview from './FilePreview';
import FirebaseInitializer from './FirebaseInitializer';
import styles from './styles.module.scss';

interface Props {
  accepted: string;
  auction: Auction;
  attachments: { uploaded: AuctionAttachment[]; loading: File[] };
  setAttachments: (_: SetStateAction<AttachmentsStateInterface>) => void;
  setErrorMessage: (_: SetStateAction<string>) => void;
  setSelectedAttachment: (_: SetStateAction<AuctionAttachment | null>) => void;
}

const UploadingDropzone: FC<Props> = ({
  accepted,
  auction,
  attachments,
  setAttachments,
  setErrorMessage,
  setSelectedAttachment,
}): ReactElement => {
  const [addAuctionMedia] = useMutation(AddAuctionMediaMutation, {
    onError(error) {
      setErrorMessage(error.networkError ? `Something went wrong. Please, try later` : error.message);
      setAttachments((prevState: AttachmentsStateInterface) => {
        return {
          ...prevState,
          uploaded: attachments.uploaded,
          loading: [],
        };
      });
    },
    onCompleted(data: any) {
      const attachment = data.addAuctionAttachment;

      setAttachments((prevState: AttachmentsStateInterface) => {
        return {
          ...prevState,
          uploaded: attachments.uploaded.concat(attachment),
          loading: attachments.loading.filter((file) => file.name !== attachment.originalFileName),
        };
      });
    },
  });

  const { id: auctionId, auctionOrganizer } = auction;
  const maxSizeGB = process.env.REACT_APP_MAX_SIZE_VIDEO_GB;
  const bytes = Math.pow(1024, 3);

  const firebaseUpload = useCallback(
    async (file: File) => {
      const uuid = getUuid();
      const extension = file.name.split('.').pop();
      const name = `${auctionOrganizer.id}/auctions/${auctionId}/${uuid}/${uuid}.${extension}`;
      try {
        const blobUrl = URL.createObjectURL(file);
        const blob = await fetch(blobUrl).then((r) => r.blob());
        // @ts-ignore
        const snapshot = await firebase.storage().ref().child(name).put(blob);
        return await snapshot.ref.getDownloadURL();
      } catch (error) {
        setErrorMessage('Somethig went wrong');
        return false;
      }
    },
    [auctionId, auctionOrganizer.id, setErrorMessage],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any) => {
      setAttachments((prevState: AttachmentsStateInterface) => {
        return {
          ...prevState,
          uploaded: attachments.uploaded,
          loading: attachments.loading.concat(acceptedFiles),
        };
      });

      acceptedFiles.forEach(async (file) => {
        let url;

        if (file.type.startsWith('video/')) {
          url = await firebaseUpload(file);

          if (!url) return;
        }

        addAuctionMedia({
          variables: { id: auctionId, file: url ? null : file, url, filename: file.name },
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
    [firebaseUpload, addAuctionMedia, setAttachments, setErrorMessage, auctionId, attachments, maxSizeGB],
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: maxSizeGB ? parseFloat(maxSizeGB) * bytes : Infinity,
    accept: accepted,
    onDrop,
  });

  return (
    <>
      <FirebaseInitializer />
      <div className="pl-md-0 pr-md-0 text-center text-sm-left d-table-row">
        {attachments.uploaded.map((attachment: AuctionAttachment, index: number) => (
          <AttachmentPreview
            key={index}
            attachment={attachment}
            auctionId={auctionId}
            setAttachments={setAttachments}
            setErrorMessage={setErrorMessage}
            setSelectedAttachment={setSelectedAttachment}
          />
        ))}
        <div className={styles.filePreviewWrapper}>
          {attachments.loading.map((file: File, index: number) => (
            <FilePreview key={index} file={file} />
          ))}
        </div>
      </div>
      <div {...getRootProps({ className: styles.dropzone })}>
        <input {...getInputProps()} name="attachment" />
        <AddPhotoIcon />
        <p className="text-center mt-2 mb-0">
          Drag images or video here
          <br />
          or click to upload
        </p>
      </div>
    </>
  );
};

export default UploadingDropzone;
