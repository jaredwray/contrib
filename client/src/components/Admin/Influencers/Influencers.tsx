import { useState } from 'react';
import { Button, Col, Container, DropdownButton, Form, Row, Spinner, Table } from "react-bootstrap";
import { gql, useQuery } from '@apollo/client';

import Layout from "../../Layout/Layout";
import InvitationModal from "./InvitationModal";
import Pagination, { PER_PAGE } from "./Pagination";

import "./Influencers.scss";

export const AllInfliencersQuery = gql`
  query GetInfliencers($size: Int!, $skip: Int!) {
    influencers(size: $size, skip: $skip) {
      totalItems
      size
      skip
      items {
        id
        name
        sport
        status
      }
    }
  }
`;

export default function Influencers() {
  const [modalShow, setModalShow] = useState(false);
  const [pageSkip, setPageSkip] = useState(0);

  const showPrevPage = () => {
    setPageSkip(pageSkip - PER_PAGE);
  }

  const showNextPage = () => {
    setPageSkip(pageSkip + PER_PAGE);
  }

  const { loading, data, error } = useQuery(AllInfliencersQuery, {
    variables: { size: PER_PAGE, skip: pageSkip },
  });

  if (error) {
    console.error('Infliencers loading error: ', error);
    return null;
  }

  const influencers = data?.influencers || { skip: 0, totalItems: 0 };

  return (
    <Layout>
      <section className="admin-influencers-page text-label pl-4 pr-4">
        <Container fluid>
          <Row>
            <Col xs="12" md="6">
              <Form.Control placeholder="Search influencer" />
            </Col>
            <Col xs="8" md="4" className="pt-3 pt-md-0 pr-0">
              <Pagination
                loading={loading}
                skip={influencers.skip}
                total={influencers.totalItems}
                showPrevPage={showPrevPage}
                showNextPage={showNextPage}
              />
            </Col>
            <Col xs="4" md="2" className="pt-3 pt-md-0">
              <Button className="btn-dark-gray w-100" onClick={() => setModalShow(true)}>Invite +</Button>
              <InvitationModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col md="10">
              {loading ? <Spinner animation="border" /> :
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
                    {influencers.items.map((influencer : any) => (
                      <tr key={influencer.id}>
                        <td className="admin-influencers-id" title={influencer.id}>{influencer.id}</td>
                        <td>{influencer.name}</td>
                        <td>{influencer.sport}</td>
                        <td>{influencer.status}</td>
                        <td>
                          <DropdownButton menuAlign="right" title="..." id="influencerActions" className="influencer-actions-dropdown" disabled={true}>
                          </DropdownButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              }
            </Col>
            <Col md="2">
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};
