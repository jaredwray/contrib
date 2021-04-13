import { useState, MouseEvent } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Col, Container, DropdownButton, Form, Row, Spinner, Table } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

import { AllInfluencersQuery, InviteInfluencerMutation } from 'src/apollo/queries/influencers';
import { InviteButton } from 'src/components/InviteButton';
import Layout from 'src/components/Layout';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import { CreateInfluencer } from './CreateInfluencer';
import Pagination, { PER_PAGE } from './Pagination';
import styles from './styles.module.scss';

export default function InfluencersPage() {
  const [pageSkip, setPageSkip] = useState(0);
  const history = useHistory();

  const showPrevPage = () => {
    setPageSkip(pageSkip - PER_PAGE);
  };

  const showNextPage = () => {
    setPageSkip(pageSkip + PER_PAGE);
  };

  const { loading, data, error } = useQuery(AllInfluencersQuery, {
    variables: { size: PER_PAGE, skip: pageSkip },
  });

  const handleSelectInfluencer = (influencer: InfluencerProfile, event: MouseEvent) => {
    if (!(event.target as Element).closest('.dropdown-actions, .modal')) {
      history.push(`/profiles/${influencer.id}`);
    }
  };

  if (error) {
    return null;
  }

  const influencers = data?.influencers || { skip: 0, totalItems: 0 };

  return (
    <Layout>
      <section className={clsx(styles.page, 'text-label p-4')}>
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
            <Col className="pt-3 pt-md-0" md="1" xs="2">
              <CreateInfluencer />
            </Col>
            <Col className="pt-3 pt-md-0" md="1" xs="2">
              <InviteButton mutation={InviteInfluencerMutation} />
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col className="w-100">
              {loading ? (
                <Spinner animation="border" />
              ) : (
                <Table className="d-block d-sm-table">
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
                      <tr
                        key={influencer.id}
                        className={styles.clickable}
                        onClick={(e: MouseEvent) => handleSelectInfluencer(influencer, e)}
                      >
                        <td className={styles.influencerId} title={influencer.id}>
                          {influencer.id}
                        </td>
                        <td className="break-word">{influencer.name}</td>
                        <td className="break-word">{influencer.sport}</td>
                        <td>{influencer.status}</td>
                        <td>
                          <DropdownButton
                            className="dropdown-actions"
                            id="influencerActions"
                            menuAlign="right"
                            title="..."
                            variant="link"
                          >
                            <Link className="dropdown-item text--body" to={`/assistants/${influencer.id}`}>
                              Assistants
                            </Link>
                            <InviteButton
                              className={clsx(styles.inviteActionBtn, 'dropdown-item text--body')}
                              mutation={InviteInfluencerMutation}
                              text="Invite"
                              variant="link"
                            />
                          </DropdownButton>
                        </td>
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
