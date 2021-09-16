import { FC, ReactElement, SetStateAction, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';
import { v4 as getUuid } from 'uuid';

import { AddAuctionMediaMutation } from 'src/apollo/queries/auctions';
import AddPhotoIcon from 'src/assets/images/ProtoIcon';
import { Auction, AuctionAttachment } from 'src/types/Auction';

import AttachmentPreview from './AttachmentPreview';
import AttachmentsStateInterface from './common/AttachmentsStateInterface';
import FilePreview from './FilePreview';
import styles from './styles.module.scss';

interface Props {
  accepted: string;
  auction: Auction;
  isVideoPage?: boolean;
  attachments: { uploaded: AuctionAttachment[]; loading: File[] };
  setAttachments: (_: SetStateAction<AttachmentsStateInterface>) => void;
  setErrorMessage: (_: SetStateAction<string>) => void;
  setSelectedAttachment: (_: SetStateAction<AuctionAttachment | null>) => void;
}

const UploadingDropzone: FC<Props> = ({
  accepted,
  auction,
  isVideoPage,
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
  const storageData = JSON.parse(process.env.REACT_APP_GOOGLE_STORAGE_DATA || '{}');

  const refreshGoogleAuthToken = useCallback(async () => {
    const res = await fetch('https://accounts.google.com/o/oauth2/token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: storageData.clientId,
        client_secret: storageData.clientSecret,
        refresh_token: storageData.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const tokenDetails = await res.json();
    return tokenDetails.access_token;
  }, [storageData.clientId, storageData.clientSecret, storageData.refreshToken]);

  const googleCLoudUpload = useCallback(
    async (file: File) => {
      const authToken = await refreshGoogleAuthToken();
      const uuid = getUuid();
      const extension = file.name.split('.').pop();
      const name = `${auctionOrganizer.id}/auctions/${auctionId}/${uuid}/${uuid}.${extension}`;
      try {
        await fetch(
          `https://storage.googleapis.com/upload/storage/v1/b/${storageData.buketName}/o?uploadType=media&name=${name}`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${authToken}` },
            body: file,
          },
        );
        return `https://storage.googleapis.com/${storageData.buketName}/${name}`;
      } catch (error) {
        setErrorMessage('Somethig went wrong');
        return false;
      }
    },
    [refreshGoogleAuthToken, auctionId, auctionOrganizer.id, setErrorMessage, storageData.buketName],
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

        if (process.env.REACT_APP_GOOGLE_STORAGE_DATA && file.type.startsWith('video/')) {
          url = await googleCLoudUpload(file);
          if (!url) return;
        }

        addAuctionMedia({
          variables: { id: auctionId, file: url ? null : file, url, filename: file.name },
        });
      });

      fileRejections.forEach((file: any) => {
        file.errors.forEach((err: any) => {
          if (err.code === 'file-too-large') {
            const sizeGB = parseFloat(maxSizeGB || '');
            let quantity;

            if (sizeGB >= 1) {
              quantity = `${sizeGB} GB`;
            } else {
              quantity = `${sizeGB * 1000} MB`;
            }
            setErrorMessage(`File is too big, max size is ${quantity}`);
          }

          if (err.code === 'file-invalid-type') {
            setErrorMessage(`Unsupported file format. ${err.message}`);
          }
        });
      });
    },
    [googleCLoudUpload, addAuctionMedia, setAttachments, setErrorMessage, auctionId, attachments, maxSizeGB],
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: maxSizeGB ? parseFloat(maxSizeGB) * bytes : Infinity,
    accept: accepted,
    onDrop,
  });

  const uploadedAttachments = attachments.uploaded.filter((attachment: AuctionAttachment) =>
    isVideoPage ? attachment.type === 'VIDEO' : attachment.type === 'IMAGE',
  );
  const hasAttachments = uploadedAttachments.length || attachments.loading.length;

  return (
    <>
      <div className={clsx('pl-md-0 pr-md-0 text-center text-sm-left', hasAttachments && 'd-table-row')}>
        {uploadedAttachments.map((attachment: AuctionAttachment, index: number) => (
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
          Drag {isVideoPage ? 'video' : 'photos'} here or
          <br />
          click to upload
        </p>
      </div>
    </>
  );
};

export default UploadingDropzone;
