import { useContext } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { AssistantsQuery, InviteAssistantMutation } from 'src/apollo/queries/assistants';
import { InviteButton } from 'src/components/InviteButton';
import Layout from 'src/components/Layout';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import styles from './styles.module.scss';

export default function Assistants() {
  const influencerId = useParams<{ influencerId?: string }>().influencerId ?? 'me';
  const { account } = useContext(UserAccountContext);

  const { loading, data, error } = useQuery<{ influencer: InfluencerProfile }>(AssistantsQuery, {
    variables: { id: influencerId },
  });
  const influencer = data?.influencer;
  const isMyProfile = account?.influencerProfile?.id === influencer?.id;

  if (loading || error || !influencer) {
    return null;
  }

  return (
    <Layout>
      <section className={clsx(styles.page, 'text-label p-4')}>
        <Container fluid>
          <Row>
            <Col className="text-headline" md="10">
              <span className="break-word">{isMyProfile ? 'My' : `${influencer.name}'s`}</span> assistants
            </Col>
            <Col className="pt-3 pt-md-0" md="2" sm="4">
              <InviteButton mutation={InviteAssistantMutation} mutationVariables={{ influencerId: influencer.id }} />
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col className="w-100 pt-4">
              {!influencer.assistants.length && <p className="text-subhead">You don't have assistants yet</p>}

              {influencer.assistants.length > 0 && (
                <Table className="admin-influencers-table d-block d-sm-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-weight-normal">
                    {influencer.assistants.map((assistant) => (
                      <tr key={assistant.id}>
                        <td className="break-word">{assistant.name}</td>
                        <td>{assistant.status}</td>
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
