import { FC } from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import Layout from 'src/components/layouts/Layout';

const Page404: FC = () => {
  return (
    <Layout>
      <Container fluid="xxl">
        <Row className="pt-5">
          <Col lg="6">
            <div className="text-super">404 error</div>
            <div className="text-headline pt-4">Page not found</div>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Page404;
