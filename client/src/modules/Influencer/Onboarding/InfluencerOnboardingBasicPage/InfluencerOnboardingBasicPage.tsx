import { FC } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { MyAccountQuery } from 'src/apollo/queries/accountQuery';
import { UpdateMyInfluencerProfileMutation } from 'src/apollo/queries/profile';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/layouts/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { UserAccount } from 'src/types/UserAccount';

import { BasicFormFields } from '../../common/BasicFormFields';
import { InfluencerOnboardingNavigation } from '../InfluencerOnboardingNavigation';
import styles from './InfluencerOnboardingBasicPage.module.scss';

interface FormValues {
  name: string;
  sport: string;
  team: string;
  profileDescription: string;
}

export const InfluencerOnboardingBasicPage: FC = () => {
  const history = useHistory();
  const { addToast } = useToasts();
  const { data: myAccountData } = useQuery<{
    myAccount: UserAccount;
  }>(MyAccountQuery);
  const [updateInfluencerProfile] = useMutation(UpdateMyInfluencerProfileMutation);

  const handleSubmit = async ({ name, sport, team, profileDescription }: FormValues) => {
    try {
      await updateInfluencerProfile({
        variables: { name, sport, team, profileDescription },
      });
      history.push('/onboarding/charities');
    } catch (error) {
      addToast(error.message, { autoDismiss: true, appearance: 'error' });
    }
  };

  const influencerProfile = myAccountData?.myAccount?.influencerProfile;
  if (!influencerProfile) {
    return null;
  }

  setPageTitle('Influencer onboarding page');

  return (
    <Layout>
      <ProgressBar className="mb-5" now={33} />

      <Form
        className="d-flex flex-column justify-content-between flex-grow-1"
        initialValues={influencerProfile}
        onSubmit={handleSubmit}
      >
        <Container>
          <Row>
            <Col className="text-label label-with-separator">Create your account</Col>
          </Row>
          <h2 className="text-headline d-flex flex-row justify-content-between">
            <span className="mr-1">Your Profile</span>
            <span className={styles.stepIndicator}>Step 1</span>
          </h2>
          <hr className="d-none d-md-block" />
          <BasicFormFields influencer={influencerProfile} />
        </Container>

        <InfluencerOnboardingNavigation step="basic" />
      </Form>
    </Layout>
  );
};
