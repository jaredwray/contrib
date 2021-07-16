import { FC, useContext } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { GetCharity, UpdateCharityProfileMutation } from 'src/apollo/queries/charityProfile';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';
import { SubmitButton } from 'src/components/SubmitButton';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { Charity } from 'src/types/Charity';

import { FormFields } from './FormFields';

interface FormValues {
  name: string;
  website: string;
  profileDescription: string;
}

export const CharityProfileEditPage: FC = () => {
  const { addToast } = useToasts();
  const charityId = useParams<{ charityId?: string }>().charityId ?? 'me';
  const { account } = useContext(UserAccountContext);
  const { data: charityProfileData } = useQuery<{
    charity: Charity;
  }>(GetCharity, { variables: { id: charityId } });
  const [updateCharityProfile] = useMutation(UpdateCharityProfileMutation);
  const history = useHistory();

  const handleSubmit = async ({ name, website, profileDescription }: FormValues) => {
    try {
      await updateCharityProfile({
        variables: { name, website: website ?? '', profileDescription, charityId },
      });

      addToast(`Your profile has been successfully updated.`, { appearance: 'success' });
      history.goBack();
    } catch (error) {
      addToast(error.message, { autoDismiss: true, appearance: 'error' });
    }
  };

  const charityProfile = charityProfileData?.charity;
  if (!charityProfile) {
    return null;
  }
  setPageTitle(charityId === 'me' ? 'My charity' : `Charity ${charityProfile.name} edit page`);

  return (
    <Layout>
      <Form
        className="d-flex flex-column justify-content-between flex-grow-1 pt-3 pt-md-5"
        initialValues={charityProfile}
        onSubmit={handleSubmit}
      >
        <Container>
          <Row>
            <Col className="text-label label-with-separator">
              {account?.isAdmin ? 'Charity Account' : 'My Charity account'}
            </Col>
          </Row>
          <h2 className="text-headline d-flex flex-row justify-content-between">
            <span className="mr-1">{account?.isAdmin ? 'Charity profile' : 'My Charity profile'}</span>
          </h2>
          <hr className="d-none d-md-block" />
          <FormFields charity={charityProfile} />
          <hr className="d-none d-md-block" />
          <SubmitButton />
        </Container>
      </Form>
    </Layout>
  );
};
