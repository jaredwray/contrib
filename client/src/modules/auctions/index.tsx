import { Container } from 'react-bootstrap';

import Layout from 'src/components/Layout';

import AuctionsOnboardingFlowAuctionsList from './AuctionsPage';

export default function Auctions() {
  return (
    <Layout>
      <Container fluid className="d-flex flex-column flex-grow-1">
        <AuctionsOnboardingFlowAuctionsList />
      </Container>
    </Layout>
  );
}
