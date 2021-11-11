import { FC } from 'react';

import clsx from 'clsx';
import { Button, Row, Col } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  currentPhoneNumber: string | undefined;
  setShowDialog: () => void;
}

const ChangePhoneNumber: FC<Props> = ({ currentPhoneNumber, setShowDialog }) => {
  return (
    <>
      <h2 className="text-headline mb-3">Profile Information</h2>
      <hr className="d-none d-md-block" />
      <Row className="mb-4">
        <Col className="pl-0 pr-0 pr-md-3" md="6">
          <h3 className="text-subhead">Phone Number</h3>
          <p className="text--body mb-2">You can change your phone number</p>
        </Col>
        <Col className="pr-0 pl-0 pl-md-3" md="6">
          <div className={styles.wraper}>
            <input disabled className={clsx(styles.input, 'form-control')} value={`+${currentPhoneNumber}`} />
            <Button className={clsx(styles.button, 'btn btn-primary')} onClick={setShowDialog}>
              Change Number
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ChangePhoneNumber;
