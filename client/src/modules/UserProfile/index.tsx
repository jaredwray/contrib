import { FC, useContext } from 'react';

import clsx from 'clsx';
import { Container, Row } from 'react-bootstrap';

import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import WithStripe from 'src/components/wrappers/WithStripe';

import Auctions from './Auctions';
import PaymentInformation from './PaymentInformation';
import ProfileInformation from './ProfileInformation';
import styles from './styles.module.scss';

const UserProfilePage: FC = () => {
  const { account } = useContext(UserAccountContext);

  return (
    <Layout>
      <section className={clsx(styles.phoneNumberSection, 'text-label p-2 pt-4 pb-4')}>
        <Container>
          <Row>
            <h1 className="text-label label-with-separator">Profile</h1>
          </Row>
          <ProfileInformation account={account} />
          <WithStripe>
            <PaymentInformation account={account} />
          </WithStripe>
        </Container>
      </section>
      <section className={clsx(styles.auctionsSection, 'text-label p-2 pt-4 pb-4')}>
        <Container>
          <Auctions />
        </Container>
      </section>
    </Layout>
  );
};

export default UserProfilePage;
