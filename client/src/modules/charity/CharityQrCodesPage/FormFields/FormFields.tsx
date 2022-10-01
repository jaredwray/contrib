import { FC } from 'react';

import clsx from 'clsx';
import { Col, Row } from 'react-bootstrap';
import QRCode from 'react-qr-code';

import { UpdateCharityProfileAvatarMutation } from 'src/apollo/queries/charityProfile';
import { AvatarPicker } from 'src/components/custom/AvatarPicker';
import InputField from 'src/components/forms/inputs/InputField';
import { Charity } from 'src/types/Charity';

import styles from './FormFields.module.scss';

interface Props {
  charity: Charity;
}

export const FormFields: FC<Props> = ({ charity }) => {
  console.log(charity);
  return (
    <>
      <Row className="container-fluid text-center">
        <Col className="pt-4 m-auto" md="4">
          <QRCode value={`http://localhost:8000/auctions/group/` + charity.id} />
        </Col>
      </Row>
      <Row className="container-fluid">
        <Col className="pt-4 m-auto" md="4">
          <InputField required name="name" title="Enter QR Code value" />
        </Col>
      </Row>
    </>
  );
};
