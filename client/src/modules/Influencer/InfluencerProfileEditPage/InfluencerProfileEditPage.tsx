import { FC, useContext } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { UpdateFavoriteCharities } from 'src/apollo/queries/charities';
import { InfluencerProfileQuery, UpdateInfluencerProfileMutation } from 'src/apollo/queries/profile';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { Charity } from 'src/types/Charity';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import { BasicFormFields } from '../common/BasicFormFields';
import { CharitiesFormFields } from '../common/CharitiesFormFields';
import { SubmitButton } from './SubmitButton';

interface FormValues {
  name: string;
  sport: string;
  team: string;
  profileDescription: string;
  favoriteCharities: Charity[];
}

export const InfluencerProfileEditPage: FC = () => {
  const { addToast } = useToasts();
  const { influencerId } = useParams<{ influencerId: string }>();
  const { account } = useContext(UserAccountContext);
  const { data: influencerProfileData } = useQuery<{
    influencer: InfluencerProfile;
  }>(InfluencerProfileQuery, { variables: { id: influencerId } });
  const [updateInfluencerProfile] = useMutation(UpdateInfluencerProfileMutation);
  const [updateFavoriteCharities] = useMutation(UpdateFavoriteCharities);

  const handleSubmit = async ({ name, sport, team, profileDescription, favoriteCharities }: FormValues) => {
    try {
      await updateInfluencerProfile({
        variables: { name, sport, team, profileDescription, influencerId },
      });

      if (influencerProfile?.favoriteCharities?.join() !== favoriteCharities.join()) {
        await updateFavoriteCharities({ variables: { influencerId, charities: favoriteCharities.map((c) => c.id) } });
      }
      addToast(`Your profile has been successfully updated.`, { appearance: 'success' });
    } catch (error) {
      addToast(error.message, { autoDismiss: true, appearance: 'error' });
    }
  };

  const influencerProfile = influencerProfileData?.influencer;
  if (!influencerProfile) {
    return null;
  }

  return (
    <Layout>
      <Form
        className="d-flex flex-column justify-content-between flex-grow-1 pt-3 pt-md-5"
        initialValues={influencerProfile}
        onSubmit={handleSubmit}
      >
        <Container>
          <Row>
            <Col className="text-label label-with-separator">{account?.isAdmin ? 'Account' : 'My account'}</Col>
          </Row>
          <h2 className="text-headline d-flex flex-row justify-content-between">
            <span className="mr-1">{account?.isAdmin ? 'Profile' : 'My Profile'}</span>
          </h2>
          <hr className="d-none d-md-block" />
          <BasicFormFields influencer={influencerProfile} />
          <h2 className="text-headline d-flex flex-row justify-content-between">
            <span className="mr-1">{account?.isAdmin ? 'Charities' : 'My Charities'}</span>
          </h2>
          <hr className="d-none d-md-block" />
          <CharitiesFormFields />

          <SubmitButton />
        </Container>
      </Form>
    </Layout>
  );
};