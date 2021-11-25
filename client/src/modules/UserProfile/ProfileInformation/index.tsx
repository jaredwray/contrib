import { FC, useState } from 'react';

import clsx from 'clsx';
import { Button, Row, Col } from 'react-bootstrap';

import { UserProfile } from 'src/components/helpers/UserAccountProvider/UserProfile';

import Modal from './Modal';
import styles from './styles.module.scss';

interface Props {
  account: UserProfile | null;
}

const ProfileInformation: FC<Props> = ({ account }) => {
  const [phoneNumber, setPhoneNumber] = useState(account?.phoneNumber?.replace('+', ''));
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <h2 className="text-headline mb-3">Profile Information</h2>
      <hr className="d-none d-md-block" />
      <Row className="mb-4">
        <Col className="pl-0 pr-0 pr-md-3" md="6">
          <div className="text--body font-weight-bold">Phone Number</div>
        </Col>
        <Col className="pr-0 pl-0 pl-md-2 pr-md-2" md="6">
          <div className={styles.wraper}>
            <input disabled className={clsx(styles.input, 'form-control')} value={`+${phoneNumber}`} />
            <Button className={clsx(styles.button, 'btn btn-primary')} onClick={() => setShowDialog(true)}>
              Change Number
            </Button>

            <Modal
              currentPhoneNumber={phoneNumber}
              setCloseDialog={() => setShowDialog(false)}
              setPhoneNumber={(value: string) => {
                setPhoneNumber(value);
              }}
              showDialog={showDialog}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ProfileInformation;
