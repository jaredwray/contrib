import { FC, useEffect, useState } from 'react';

import clsx from 'clsx';
import QRCode from 'qrcode';
import { Button } from 'react-bootstrap';

import ShareIcon from 'src/assets/icons/ShareIcon';

import { QRCodeModal } from './Modal';
import styles from './styles.module.scss';

interface Props {
  charityName: string;
  link: string;
}

const ShareBtn: FC<Props> = ({ charityName, link }) => {
  const [src, setSrc] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(link).then((data) => setSrc(data));
  }, [link]);

  return (
    <>
      <div
        className={clsx(styles.container, 'my-3 py-3 d-table align-middle w-100')}
        onClick={() => setShowDialog(true)}
      >
        <Button className={clsx(styles.button)} variant="link">
          <div>
            <ShareIcon />
          </div>
        </Button>
        <div className="d-table-cell ps-4 align-middle">
          <div className={clsx(styles.text, 'text-subhead')}>Share via QR Code</div>
        </div>
      </div>
      <QRCodeModal name={charityName} open={showDialog} src={src} onClose={() => setShowDialog(false)} />
    </>
  );
};

export default ShareBtn;
