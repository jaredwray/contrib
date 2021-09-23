import { FC, useContext } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { UpdateFavoriteCharities } from 'src/apollo/queries/charities';
import { InfluencerProfileQuery, UpdateInfluencerProfileMutation } from 'src/apollo/queries/profile';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';
import { SubmitButton } from 'src/components/SubmitButton';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { Charity } from 'src/types/Charity';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import { BasicFormFields } from '../common/BasicFormFields';
import { CharitiesFormFields } from '../common/CharitiesFormFields';
import styles from './styles.module.scss';

interface FormValues {
  name: string;
  sport: string;
  team: string;
  profileDescription: string;
  favoriteCharities: Charity[];
}

export const InfluencerProfileEditPage: FC = () => {
  const influencerId = useParams<{ influencerId: string }>().influencerId ?? 'me';
  const { account } = useContext(UserAccountContext);
  const { data: influencerProfileData } = useQuery<{
    influencer: InfluencerProfile;
  }>(InfluencerProfileQuery, { variables: { id: influencerId } });
  const [updateInfluencerProfile] = useMutation(UpdateInfluencerProfileMutation);
  const [updateFavoriteCharities] = useMutation(UpdateFavoriteCharities);
  const history = useHistory();
  const { showMessage, showError } = useShowNotification();

  const handleSubmit = async ({ name, sport, team, profileDescription, favoriteCharities }: FormValues) => {
    try {
      await updateInfluencerProfile({
        variables: { name, sport, team: team ?? '', profileDescription, influencerId },
      });

      if (influencerProfile?.favoriteCharities?.join() !== favoriteCharities.join()) {
        await updateFavoriteCharities({ variables: { influencerId, charities: favoriteCharities.map((c) => c.id) } });
      }
      showMessage('Your profile has been successfully updated');
      history.goBack();
    } catch (error) {
      showError(error.message);
    }
  };

  const influencerProfile = influencerProfileData?.influencer;
  if (influencerProfile === null) {
    history.replace('/404');
    return null;
  }

  if (influencerProfile === undefined) {
    return null;
  }

  setPageTitle(`${influencerId === 'me' ? 'My' : `${influencerProfile.name}'s`} Profile edit page`);

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
          <Row>
            <Col className="text-headline">{account?.isAdmin ? 'Profile' : 'My Profile'}</Col>
            <hr className={clsx(styles.hr, 'd-none d-md-block')} />
          </Row>
          <BasicFormFields influencer={influencerProfile} />
          <Col>
            <h2 className="text-headline d-flex flex-row justify-content-between">
              <span className="mr-1">{account?.isAdmin ? 'Charities' : 'My Charities'}</span>
            </h2>
          </Col>
          <hr className="d-none d-md-block" />
          <CharitiesFormFields />
          <Col>
            <SubmitButton text="Save" />
          </Col>
        </Container>
      </Form>
    </Layout>
  );
};
