import { FC } from 'react';

import clsx from 'clsx';
import { Col, Row } from 'react-bootstrap';

import { UpdateCharityProfileAvatarMutation } from 'src/apollo/queries/charityProfile';
import { AvatarPicker } from 'src/components/AvatarPicker';
import InputField from 'src/components/Form/InputField';
import { Charity } from 'src/types/Charity';

import styles from './FormFields.module.scss';

interface Props {
  charity: Charity;
}

export const FormFields: FC<Props> = ({ charity }) => {
  return (
    <Row className="pt-3 pt-md-0">
      <Col md="6">
        <div className={clsx(styles.avatarBlock, 'd-flex flex-column align-items-center')}>
          <AvatarPicker item={charity} itemId="charityId" updateMutation={UpdateCharityProfileAvatarMutation} />
        </div>
      </Col>
      <Col className="pt-4 pt-md-0" md="6">
        <InputField required name="name" title="Enter charity name" />
        <InputField required name="websiteUrl" title="Enter charity website" />
        <InputField required textarea className={styles.textarea} name="profileDescription" title="Enter description" />
      </Col>
    </Row>
  );
};