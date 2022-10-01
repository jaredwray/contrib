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
}

export const CharityQrCodesPage: FC = () => {
  const charityId = useParams<{ charityId?: string }>().charityId ?? 'me';
  const { account } = useContext(UserAccountContext);
  const { data: charityProfileData } = useQuery<{
    charity: Charity;
  }>(GetCharity, { variables: { id: charityId } });
  const [updateCharityProfile] = useMutation(UpdateCharityProfileMutation);
  const history = useHistory();
  const { showMessage, showError } = useShowNotification();

  const handleSubmit = async ({ name, website }: FormValues) => {
    try {
      await updateCharityProfile({
        variables: { name, website: website ?? '', charityId },
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

  setPageTitle(charityId === 'me' ? 'My charity' : `${charityProfile.name} QR Codes`);

  return (
    <Layout>
      <Form
        className="d-flex flex-column justify-content-between flex-grow-1 pt-3 pt-md-5"
        initialValues={charityProfile}
        onSubmit={handleSubmit}
      >
        <Container className="text-center" fluid="xxl">
          <Row className="mb-4">
            <Col className="text-headline">{`${!account?.isAdmin ? 'My ' : ''}Generate QR Code`}</Col>
          </Row>
          <FormFields charity={charityProfile} />
          <SubmitButton text="Generate" />
        </Container>
      </Form>
    </Layout>
  );
};
