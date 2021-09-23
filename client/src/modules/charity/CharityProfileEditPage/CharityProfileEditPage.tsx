import { FC, useContext } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { GetCharity, UpdateCharityProfileMutation } from 'src/apollo/queries/charityProfile';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';
import { SubmitButton } from 'src/components/SubmitButton';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { Charity } from 'src/types/Charity';

import { FormFields } from './FormFields';
import styles from './styles.module.scss';

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
  if (charityProfile === undefined) {
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
          <Row>
            <Col className="text-headline">{account?.isAdmin ? 'Charity profile' : 'My Charity profile'}</Col>
            <hr className={clsx(styles.hr, 'd-none d-md-block')} />
          </Row>
          <FormFields charity={charityProfile} />
          <hr className="d-none d-md-block" />
          <Col>
            <SubmitButton text="Save" />
          </Col>
        </Container>
      </Form>
    </Layout>
  );
};
