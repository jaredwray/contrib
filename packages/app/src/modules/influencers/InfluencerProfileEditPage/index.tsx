import { FC, useContext, useCallback } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { UpdateFavoriteCharities } from 'src/apollo/queries/charities';
import { InfluencerProfileQuery, UpdateInfluencerProfileMutation } from 'src/apollo/queries/profile';
import { SubmitButton } from 'src/components/buttons/SubmitButton';
import Form from 'src/components/forms/Form/Form';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { Charity } from 'src/types/Charity';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import { BasicFormFields } from '../common/BasicFormFields';
import CharitiesFormFields from '../common/CharitiesFormFields';

interface FormValues {
  name: string;
  sport: string;
  team: string;
  profileDescription: string;
  favoriteCharities: Charity[];
}

const InfluencerProfileEditPage: FC = () => {
  const influencerId = useParams<{ influencerId: string }>().influencerId ?? 'me';
  const { account } = useContext(UserAccountContext);
  const history = useHistory();
  const { showMessage, showError } = useShowNotification();
  const isAdminOrAssistant = account?.isAdmin || account?.assistant;

  const { data: influencerProfileData } = useQuery<{
    influencer: InfluencerProfile;
  }>(InfluencerProfileQuery, { variables: { id: influencerId }, fetchPolicy: 'cache-and-network' });
  const [updateInfluencerProfile] = useMutation(UpdateInfluencerProfileMutation);
  const [updateFavoriteCharities] = useMutation(UpdateFavoriteCharities);

  const onSubmit = useCallback(
    async ({ name, sport, profileDescription, favoriteCharities, team = '' }: FormValues) => {
      const charities = favoriteCharities.map((charity) => charity.id);

      try {
        await updateInfluencerProfile({ variables: { name, sport, team, profileDescription, influencerId } });
        await updateFavoriteCharities({ variables: { influencerId, charities } });

        showMessage('Your profile has been successfully updated');
        history.goBack();
      } catch (error) {
        showError(error.message);
      }
    },
    [history, influencerId, showError, showMessage, updateFavoriteCharities, updateInfluencerProfile],
  );

  if (influencerId && account?.assistant) {
    const assistantInfluencerIds = account?.assistant?.influencerIds || [];

    if (!assistantInfluencerIds.includes(influencerId)) {
      history.replace('/');
      return null;
    }
  }

  const influencerProfile = influencerProfileData?.influencer;

  if (influencerProfile === null) {
    history.replace('/404');
    return null;
  }
  if (influencerProfile === undefined) return null;

  setPageTitle(`${influencerId === 'me' ? 'My' : `${influencerProfile.name}'s`} Profile edit page`);

  return (
    <Layout>
      <Form
        className="d-flex flex-column justify-content-between flex-grow-1 pt-3 pt-md-5"
        initialValues={influencerProfile}
        onSubmit={onSubmit}
      >
        <Container fluid="xxl">
          <Row>
            <Col className="text-label label-with-separator">{isAdminOrAssistant ? 'Account' : 'My account'}</Col>
          </Row>
          <Row>
            <Col className="text-headline">{isAdminOrAssistant ? 'Profile' : 'My Profile'}</Col>
          </Row>
          <BasicFormFields influencer={influencerProfile} />
          <Col>
            <h2 className="text-headline d-flex flex-row justify-content-between">
              <span className="me-1">{isAdminOrAssistant ? 'Charities' : 'My Charities'}</span>
            </h2>
          </Col>
          <hr className="d-none d-md-block" />
          <CharitiesFormFields />
          <Col className="pe-2">
            <SubmitButton text="Save" />
          </Col>
        </Container>
      </Form>
    </Layout>
  );
};

export default InfluencerProfileEditPage;
