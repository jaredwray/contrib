import { useQuery } from '@apollo/client';
import { Accordion, Container, Row, Col } from 'react-bootstrap';

import { TermsListQuery } from 'src/apollo/queries/terms';
import Layout from 'src/components/Layout';
import PrivacyCard from 'src/components/PrivacyCard';

export default function Privacy() {
  const { loading, error, data } = useQuery(TermsListQuery);

  if (loading || error) {
    return null;
  }

  const terms = data.terms;

  return (
    <Layout>
      <Container className="p-sm-4 pt-3 pl-2 pr-2 pb-3">
        <Row>
          <Col className="text-label label-with-separator">Our Privacy and Terms</Col>
        </Row>
        <Row>
          <Col>
            <Accordion>
              <PrivacyCard eventKey="0" role="account" roleInTitle="Users" terms={terms.userAccount} />
              <PrivacyCard eventKey="1" role="influencer" roleInTitle="Influencers" terms={terms.influencer} />
              <PrivacyCard eventKey="2" role="assistant" roleInTitle="Assistants" terms={terms.assistant} />
            </Accordion>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
