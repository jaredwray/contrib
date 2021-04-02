import { ChangeEvent, FC, useCallback, useRef, useState } from 'react';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Button, Image } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';

import { UpdateInfluencerProfileAvatarMutation } from 'src/apollo/queries/profile';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import styles from './AvatarPicker.module.scss';

const MAX_AVATAR_SIZE_MB = 2;

const ACCEPTED_FILE_TYPES = ['png', 'jpeg', 'jpg', 'webp'];
const ACCEPTED_FILE_TYPES_STRING = ACCEPTED_FILE_TYPES.map((t) => `.${t}`).join(',');

interface Props {
  influencer: InfluencerProfile;
}

export const AvatarPicker: FC<Props> = ({ influencer }) => {
  const { addToast } = useToasts();
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateInfluencerProfileAvatar] = useMutation(UpdateInfluencerProfileAvatarMutation);

  const handleError = useCallback(
    (errorMessage: string) => {
      addToast(errorMessage, { autoDismiss: true, appearance: 'error' });
    },
    [addToast],
  );

  const handleFileUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const image = getFileToUpload(event, handleError);
      if (!image) {
        return;
      }

      setUploadPreviewUrl(URL.createObjectURL(image));

      updateInfluencerProfileAvatar({
        variables: { influencerId: influencer.id, image },
      }).catch((error) => {
        handleError(error.message);
      });
    },
    [updateInfluencerProfileAvatar, handleError, influencer.id],
  );

  const handleSelectFileToUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [fileInputRef]);

  if (!influencer) {
    return null;
  }

  return (
    <>
      <input
        ref={fileInputRef}
        accept={ACCEPTED_FILE_TYPES_STRING}
        className="d-none"
        id="avatarFileInput"
        type="file"
        onChange={handleFileUpload}
      />
      <Image
        roundedCircle
        className={styles.image}
        id="profileAvatar"
        src={uploadPreviewUrl || ResizedImageUrl(influencer.avatarUrl, 120)}
        onClick={handleSelectFileToUpload}
      />
      <Button
        className={clsx(styles.uploadButton, 'text-label text-all-cups')}
        variant="dark"
        onClick={handleSelectFileToUpload}
      >
        change photo
      </Button>
    </>
  );
};

function getFileToUpload(event: ChangeEvent<HTMLInputElement>, handleError: (message: string) => void): File | null {
  if (!event.target.files?.length) {
    return null;
  }

  const image = event.target.files[0];
  const fileSizeInMegaBytes = image.size / (1024 * 1024);

  if (fileSizeInMegaBytes > MAX_AVATAR_SIZE_MB) {
    handleError(`File is too big! Maximum allowed size is ${MAX_AVATAR_SIZE_MB}MB`);
    return null;
  }

  const ext = image.name.split('.').pop() ?? '';
  if (!ACCEPTED_FILE_TYPES.includes(ext)) {
    handleError(`Only following image types are supported: ${ACCEPTED_FILE_TYPES.join(', ')}`);
    return null;
  }

  return image;
}
