import { FC, useCallback } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { UpdateMyFavoriteCharities } from 'src/apollo/queries/charities';
import { MyProfileQuery } from 'src/apollo/queries/profile';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';
import { Charity } from 'src/types/Charity';
import { UserAccount } from 'src/types/UserAccount';

import { CharitiesFormFields } from '../../common/CharitiesFormFields';
import { InfluencerOnboardingNavigation } from '../InfluencerOnboardingNavigation';
import styles from './InfluencerOnboardingCharitiesPage.module.scss';

interface FormValues {
  favoriteCharities: Charity[];
}

export const InfluencerOnboardingCharitiesPage: FC = () => {
  const { addToast } = useToasts();
  const history = useHistory();
  const { data: myAccountData } = useQuery<{ myAccount: UserAccount }>(MyProfileQuery);
  const [updateMyFavoriteCharities] = useMutation(UpdateMyFavoriteCharities);

  const handleSubmit = useCallback(
    async ({ favoriteCharities }: FormValues) => {
      try {
        await updateMyFavoriteCharities({ variables: { charities: favoriteCharities.map((c) => c.id) } });
        history.push('/onboarding/done');
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'error' });
      }
    },
    [updateMyFavoriteCharities, addToast, history],
  );

  const influencerProfile = myAccountData?.myAccount?.influencerProfile;
  if (!influencerProfile) {
    return null;
  }

  return (
    <Layout>
      <ProgressBar className="mb-5" now={66} />

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
            <span className="mr-1">Your Charities</span>
            <span className={styles.stepIndicator}>Step 2</span>
          </h2>
          <hr className="d-none d-md-block" />
          <CharitiesFormFields />
        </Container>

        <InfluencerOnboardingNavigation step="charities" />
      </Form>
    </Layout>
  );
};