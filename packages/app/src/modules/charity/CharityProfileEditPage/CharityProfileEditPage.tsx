import { FC, useContext } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { GetCharity, UpdateCharityProfileMutation } from 'src/apollo/queries/charityProfile';
import { SubmitButton } from 'src/components/buttons/SubmitButton';
import Form from 'src/components/forms/Form/Form';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { Charity } from 'src/types/Charity';

import { FormFields } from './FormFields';

interface FormValues {
  name: string;
  website: string;
  profileDescription: string;
}

export const CharityProfileEditPage: FC = () => {
  const charityId = useParams<{ charityId?: string }>().charityId ?? 'me';
  const { account } = useContext(UserAccountContext);
  const { data: charityProfileData } = useQuery<{
    charity: Charity;
  }>(GetCharity, { variables: { id: charityId } });
  const [updateCharityProfile] = useMutation(UpdateCharityProfileMutation);
  const history = useHistory();
  const { showMessage, showError } = useShowNotification();

  const handleSubmit = async ({ name, website, profileDescription }: FormValues) => {
    try {
      await updateCharityProfile({
        variables: { name, website: website ?? '', profileDescription, charityId },
      });
      showMessage('Your profile has been successfully updated.');
      history.goBack();
    } catch (error) {
      showError(error.message);
    }
  };

  const charityProfile = charityProfileData?.charity;

  if (charityProfile === null) {
    history.replace('/404');
    return null;
  }
  if (charityProfile === undefined) return null;

  setPageTitle(charityId === 'me' ? 'My charity' : `Charity ${charityProfile.name} edit page`);

  return (
    <Layout>
      <Form
        className="d-flex flex-column justify-content-between flex-grow-1 pt-3 pt-md-5"
        initialValues={charityProfile}
        onSubmit={handleSubmit}
      >
        <Container fluid="xxl">
          <Row>
            <Col className="text-label label-with-separator">{`${!account?.isAdmin ? 'My ' : ''}Charity Account`}</Col>
          </Row>
          <Row>
            <Col className="text-headline">{`${!account?.isAdmin ? 'My ' : ''}Charity Profile`}</Col>
          </Row>
          <FormFields charity={charityProfile} />
          <Col>
            <SubmitButton text="Save" />
          </Col>
        </Container>
      </Form>
    </Layout>
  );
};
