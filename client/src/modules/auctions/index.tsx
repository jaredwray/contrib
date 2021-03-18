import { Container } from 'react-bootstrap';

import Layout from 'src/components/Layout';

import AuctionsPage from './AuctionsPage';

export default function Auctions() {
  return (
    <Layout>
      <Container fluid className="d-flex flex-column flex-grow-1">
        <AuctionsPage />
      </Container>
    </Layout>
  );
}
