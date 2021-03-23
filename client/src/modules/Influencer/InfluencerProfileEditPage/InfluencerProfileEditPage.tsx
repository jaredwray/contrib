import { FC } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Col, Container, Row } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';

import { UpdateMyFavoriteCharities } from 'src/apollo/queries/charities';
import { MyProfileQuery, UpdateInfluencerProfileMutation } from 'src/apollo/queries/profile';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';
import { Charity } from 'src/types/Charity';
import { UserAccount } from 'src/types/UserAccount';

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
  const { data: myAccountData } = useQuery<{
    myAccount: UserAccount;
  }>(MyProfileQuery);
  const [updateInfluencerProfile] = useMutation(UpdateInfluencerProfileMutation);
  const [updateMyFavoriteCharities] = useMutation(UpdateMyFavoriteCharities);

  const handleSubmit = async ({ name, sport, team, profileDescription, favoriteCharities }: FormValues) => {
    try {
      await updateInfluencerProfile({
        variables: { name, sport, team, profileDescription },
      });

      if (influencerProfile?.favoriteCharities?.join() !== favoriteCharities.join()) {
        await updateMyFavoriteCharities({ variables: { charities: favoriteCharities.map((c) => c.id) } });
      }
      addToast(`Your profile has been successfully updated.`, { appearance: 'success' });
    } catch (error) {
      addToast(error.message, { autoDismiss: true, appearance: 'error' });
    }
  };

  const influencerProfile = myAccountData?.myAccount?.influencerProfile;
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
            <Col className="text-label label-with-separator">My account</Col>
          </Row>
          <h2 className="text-headline d-flex flex-row justify-content-between">
            <span className="mr-1">My Profile</span>
          </h2>
          <hr className="d-none d-md-block" />
          <BasicFormFields />
          <h2 className="text-headline d-flex flex-row justify-content-between">
            <span className="mr-1">My Charities</span>
          </h2>
          <hr className="d-none d-md-block" />
          <CharitiesFormFields />

          <SubmitButton />
        </Container>
      </Form>
    </Layout>
  );
};
