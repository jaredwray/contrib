import { FC, useState } from 'react';

import clsx from 'clsx';
import { Button, Row, Col } from 'react-bootstrap';

import { UserAccount } from 'src/types/UserAccount';

import Modal from './Modal';
import styles from './styles.module.scss';

interface Props {
  account: UserAccount | null;
}

const ProfileInformation: FC<Props> = ({ account }) => {
  const [phoneNumber, setPhoneNumber] = useState(account?.phoneNumber?.replace('+', ''));
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <h2 className="text-headline mb-3">Profile Information</h2>
      <hr className="d-none d-md-block" />
      <Row className="mb-4">
        <Col className="px-0 px-md-3" md="6">
          <div className="text--body fw-bold">Phone Number</div>
        </Col>
        <Col className="px-0 px-md-2" md="6">
          <div className={styles.wraper}>
            <input disabled className={clsx(styles.input, 'form-control')} value={`+${phoneNumber}`} />
            <Button className={clsx(styles.button, 'btn btn-primary m-auto')} onClick={() => setShowDialog(true)}>
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
