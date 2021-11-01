import { FC, useState, useContext } from 'react';

import clsx from 'clsx';
import { Container, Row } from 'react-bootstrap';

import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';

import Auctions from './Content/Auctions';
import ChangePhoneNumber from './Content/ChangePhoneNumber';
import Modal from './Modal';
import styles from './styles.module.scss';

const UserProfilePage: FC = () => {
  const { account } = useContext(UserAccountContext);

  const [phoneNumber, setPhoneNumber] = useState(account?.phoneNumber?.replace('+', ''));
  const [showDialog, setShowDialog] = useState(false);

  return (
    <Layout>
      <section className={clsx(styles.phoneNumberSection, 'text-label p-2 pt-4 pb-4')}>
        <Container>
          <Row>
            <h1 className="text-label label-with-separator">Profile</h1>
          </Row>
          <ChangePhoneNumber
            currentPhoneNumber={phoneNumber}
            setShowDialog={() => {
              setShowDialog(true);
            }}
          />
        </Container>
      </section>
      <section className={clsx(styles.auctionsSection, 'text-label p-2 pt-4 pb-4')}>
        <Container>
          <Modal
            currentPhoneNumber={phoneNumber}
            setCloseDialog={() => setShowDialog(false)}
            setPhoneNumber={(value: string) => {
              setPhoneNumber(value);
            }}
            showDialog={showDialog}
          />
          <Auctions />
        </Container>
      </section>
    </Layout>
  );
};

export default UserProfilePage;
