import { FC } from 'react';

import clsx from 'clsx';
import { Col, Row } from 'react-bootstrap';

import InputField from 'src/components/Form/InputField';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import { AvatarPicker } from './AvatarPicker';
import styles from './BasicFormFields.module.scss';

interface Props {
  influencer: InfluencerProfile;
}

export const BasicFormFields: FC<Props> = ({ influencer }) => {
  return (
    <Row className="pt-3 pt-md-0">
      <Col md="6">
        <div className={clsx(styles.avatarBlock, 'd-flex flex-column align-items-center')}>
          <AvatarPicker influencer={influencer} />
        </div>
      </Col>
      <Col className="pt-4 pt-md-0" md="6">
        <InputField required name="name" title="Enter your name" />
        <InputField required name="sport" title="Enter your sport" />
        <InputField required name="team" title="Enter your team name" />
        <InputField required textarea className={styles.textarea} name="profileDescription" title="Enter description" />
      </Col>
    </Row>
  );
};
