import { FC, ReactElement } from 'react';

import { useDropzone } from 'react-dropzone';

import styles from './styles.module.scss';

interface Props {
  accepted: string;
  name: string;
  auctionId: string;
  icon: any;
  updateAuctionMedia: (options: any) => void;
}

const UploadingDropzone: FC<Props> = ({ accepted, name, icon, auctionId, updateAuctionMedia }): ReactElement => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: accepted,
    onDrop: ([file]) => {
      updateAuctionMedia({
        variables: { id: auctionId, file },
      });
    },
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })} className={styles.dropzone}>
      <input {...getInputProps()} name={name} />
      {icon}
      <p className="text-center">
        Drag {name} here or
        <br />
        click to upload
      </p>
    </div>
  );
};

export default UploadingDropzone;
