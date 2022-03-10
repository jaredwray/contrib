import { Container, Row, Col } from 'react-bootstrap';

import Layout from 'src/components/layouts/Layout';
import TermsText from 'src/components/modals/TermsConfirmationDialog/TermsText';
import { setPageTitle } from 'src/helpers/setPageTitle';

export default function Terms() {
  setPageTitle('Terms');

  return (
    <Layout>
      <Container className="p-sm-4 px-2 py-3">
        <Row>
          <Col className="text-label label-with-separator">Our Terms</Col>
        </Row>
        <Row>
          <Col>
            <TermsText />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
