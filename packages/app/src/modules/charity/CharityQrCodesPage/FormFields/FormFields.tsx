import { FC, useState } from 'react';

import { Col, Row } from 'react-bootstrap';
import QRCode from 'react-qr-code';

import { Charity } from 'src/types/Charity';

import styles from './FormFields.module.scss';

interface Props {
  charity: Charity;
}

export const FormFields: FC<Props> = ({ charity }) => {
  const [value, setValue] = useState(`https://contrib.org/auctions/group/` + charity.semanticId);
  const handleKeyPress = (e: any) => {
    setValue(e.target.value);
  };
  const downloadQrCode = () => {
    const svg = document.getElementById('QRCode') as HTMLImageElement;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'QRCode';
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };
  return (
    <>
      <Row className="container-fluid text-center">
        <Col className="pt-4 m-auto" md="4">
          <QRCode id="QRCode" value={value} />
        </Col>
      </Row>
      <Row className="container-fluid">
        <Col className="pt-4 m-auto" md="4">
          <input
            disabled
            className={styles.inputUrl}
            title={'Enter QR Code url'}
            value={value}
            onChange={handleKeyPress}
          />
        </Col>
      </Row>
      <button className="btn btn-primary m-auto mt-4" onClick={downloadQrCode}>
        Download
      </button>
    </>
  );
};
