import { Container, Row, Col } from 'react-bootstrap';

import Layout from 'src/components/Layout';
import TermsText from 'src/components/TermsText';

export default function Terms() {
  return (
    <Layout>
      <Container className="p-sm-4 pt-3 pl-2 pr-2 pb-3">
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
