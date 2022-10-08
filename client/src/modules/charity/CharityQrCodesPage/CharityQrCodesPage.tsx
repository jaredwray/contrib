import { FC, useContext } from 'react';

import { useQuery } from '@apollo/client';
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { GetCharity } from 'src/apollo/queries/charityProfile';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { Charity } from 'src/types/Charity';

import { FormFields } from './FormFields';

export const CharityQrCodesPage: FC = () => {
  const charityId = useParams<{ charityId?: string }>().charityId ?? 'me';
  const { account } = useContext(UserAccountContext);
  const { data: charityProfileData } = useQuery<{
    charity: Charity;
  }>(GetCharity, { variables: { id: charityId } });
  const history = useHistory();

  const charityProfile = charityProfileData?.charity;

  if (charityProfile === null) {
    history.replace('/404');
    return null;
  }
  if (charityProfile === undefined) return null;

  setPageTitle(charityId === 'me' ? 'My charity' : `${charityProfile.name} QR Codes`);

  return (
    <Layout>
      <Container className="text-center" fluid="xxl">
        <Row className="my-4">
          <Col className="text-headline">{`${!account?.isAdmin ? 'My ' : ''}Generate QR Code`}</Col>
        </Row>
        <FormFields charity={charityProfile} />
      </Container>
    </Layout>
  );
};
