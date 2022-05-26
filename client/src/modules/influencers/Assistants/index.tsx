import { useContext, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';

import { AssistantsQuery, InviteAssistantMutation } from 'src/apollo/queries/assistants';
import { InviteButton } from 'src/components/buttons/InviteButton';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import styles from './styles.module.scss';

export default function Assistants() {
  const history = useHistory();
  const influencerId = useParams<{ influencerId?: string }>().influencerId ?? 'me';
  const { account } = useContext(UserAccountContext);

  const [getAssistatsList, { data }] = useLazyQuery<{ influencer: InfluencerProfile }>(AssistantsQuery, {
    variables: { id: influencerId },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => getAssistatsList(), [getAssistatsList]);

  const influencer = data?.influencer;
  const assistants = influencer?.assistants || [];
  const isMyProfile = account?.influencerProfile?.id === influencer?.id;

  if (influencer === null) {
    history.replace('/404');
    return null;
  }
  if (influencer === undefined) return null;

  setPageTitle(`${influencerId === 'me' ? 'My' : `${influencer.name}'s`} assistants`);

  return (
    <Layout>
      <section className={clsx(styles.page, 'text-label p-4')}>
        <Container fluid="xxl">
          <Row>
            <Col className="text-headline" md="10">
              <span className="break-word">{isMyProfile ? 'My' : `${influencer.name}'s`}</span> assistants
            </Col>
            <Col className="pt-3 pt-md-0" md="2" sm="4">
              <InviteButton
                mutation={InviteAssistantMutation}
                mutationVariables={{ influencerId: influencer.id }}
                updateEntitisList={getAssistatsList}
              />
            </Col>
          </Row>
        </Container>
        <Container fluid="xxl">
          <Row>
            <Col className="w-100 pt-4">
              {!assistants?.length && <p className="text-subhead">You don't have assistants yet</p>}
              {assistants?.length > 0 && (
                <Table className="admin-influencers-table d-block d-sm-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th className={styles.status}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="fw-normal">
                    {assistants.map((assistant) => (
                      <tr key={assistant.id}>
                        <td className="break-word">{assistant.name}</td>
                        <td className={styles.status}>{assistant.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
            <Col md="2" />
          </Row>
        </Container>
      </section>
    </Layout>
  );
}
