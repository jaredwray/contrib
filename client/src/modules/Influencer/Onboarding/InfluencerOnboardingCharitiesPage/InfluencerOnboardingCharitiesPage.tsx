import { FC, useCallback } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Col, Container, Form as BsForm, ProgressBar, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { MyFavoriteCharitiesQuery, UpdateMyFavoriteCharities } from 'src/apollo/queries/charities';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';
import { Charity } from 'src/types/Charity';
import { UserAccount } from 'src/types/UserAccount';

import { InfluencerOnboardingNavigation } from '../InfluencerOnboardingNavigation';
import { FavoriteCharitiesField } from './FavoriteCharitiesField';
import styles from './InfluencerOnboardingCharitiesPage.module.scss';

interface FormValues {
  favoriteCharities: Charity[];
}

export const InfluencerOnboardingCharitiesPage: FC = () => {
  const { addToast } = useToasts();
  const history = useHistory();
  const { data: myAccountData } = useQuery<{ myAccount: UserAccount }>(MyFavoriteCharitiesQuery);
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
          <Row className="pt-3 pt-md-0">
            <Col md="6">
              <div className="text-subhead">Choose your charities</div>
              <div className="text--body pt-0 pt-md-2">
                Choose a number of charities onboarded with Contrib that you want to access more frequently.
              </div>
            </Col>
            <Col className="pt-2 pt-md-0" md="6">
              <FavoriteCharitiesField name="favoriteCharities" />
            </Col>
          </Row>
          <Row className="buffer d-none d-md-block" />
          <hr className="mt-0" />
          <Row className="pt-3 pt-md-0">
            <Col md="6">
              <div className="text-subhead">Don’t see your charity?</div>
              <div className="text--body pt-0 pt-md-2">
                If your charity isn’t listed send us their info and we will add them to Contrib.
              </div>
            </Col>
            <Col className="pt-2 pt-md-0" md="6">
              <BsForm.Group>
                <BsForm.Label>Name</BsForm.Label>
                <BsForm.Control placeholder="Enter charity name" />
              </BsForm.Group>
              <BsForm.Group>
                <BsForm.Label>Contact</BsForm.Label>
                <BsForm.Control placeholder="Enter website or social" />
              </BsForm.Group>
            </Col>
          </Row>
        </Container>

        <InfluencerOnboardingNavigation step="charities" />
      </Form>
    </Layout>
  );
};
