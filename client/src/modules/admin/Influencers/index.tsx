import { useState } from 'react';

import { useQuery } from '@apollo/client';
import { Button, Col, Container, DropdownButton, Form, Row, Spinner, Table } from 'react-bootstrap';

import { AllInfluencersQuery } from 'src/apollo/queries/influencers';
import Layout from 'src/components/Layout';

import InvitationModal from './InvitationModal';
import Pagination, { PER_PAGE } from './Pagination';

import './styles.scss';

export default function InfluencersPage() {
  const [modalShow, setModalShow] = useState(false);
  const [pageSkip, setPageSkip] = useState(0);

  const showPrevPage = () => {
    setPageSkip(pageSkip - PER_PAGE);
  };

  const showNextPage = () => {
    setPageSkip(pageSkip + PER_PAGE);
  };

  const { loading, data, error } = useQuery(AllInfluencersQuery, {
    variables: { size: PER_PAGE, skip: pageSkip },
  });

  if (error) {
    console.error('Influencers loading error: ', error);
    return null;
  }

  const influencers = data?.influencers || { skip: 0, totalItems: 0 };

  return (
    <Layout>
      <section className="admin-influencers-page text-label pl-4 pr-4">
        <Container fluid>
          <Row>
            <Col md="6" xs="12">
              <Form.Control placeholder="Search influencer" />
            </Col>
            <Col className="pt-3 pt-md-0 pr-0" md="4" xs="8">
              <Pagination
                loading={loading}
                showNextPage={showNextPage}
                showPrevPage={showPrevPage}
                skip={influencers.skip}
                total={influencers.totalItems}
              />
            </Col>
            <Col className="pt-3 pt-md-0" md="2" xs="4">
              <Button className="btn-dark-gray w-100 text-label" onClick={() => setModalShow(true)}>
                Invite +
              </Button>
              <InvitationModal show={modalShow} onHide={() => setModalShow(false)} />
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col md="10">
              {loading ? (
                <Spinner animation="border" />
              ) : (
                <Table className="admin-influencers-table d-block d-sm-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Sport</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="font-weight-normal">
                    {influencers.items.map((influencer: any) => (
                      <tr key={influencer.id}>
                        <td className="admin-influencers-id" title={influencer.id}>
                          {influencer.id}
                        </td>
                        <td>{influencer.name}</td>
                        <td>{influencer.sport}</td>
                        <td>{influencer.status}</td>
                        <td>
                          <DropdownButton
                            className="influencer-actions-dropdown"
                            disabled={true}
                            id="influencerActions"
                            menuAlign="right"
                            title="..."
                            variant="link"
                          ></DropdownButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
            <Col md="2"></Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
}
