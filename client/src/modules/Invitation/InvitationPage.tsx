import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import Layout from '../../components/Layout';

import './InvitationPage.scss';

export const GetInvitation = gql`
  query GetInvitation($slug: String!) {
    invitation(slug: $slug) {
      firstName
      welcomeMessage
    }
  }
`;

export default function InvitationPage() {
  const { loginWithRedirect } = useAuth0();
  const { slug } = useParams<{ slug: string }>();

  const { loading, data, error } = useQuery(GetInvitation, {
    variables: { slug: slug },
  });

  if (loading) {
    return <>Loading...</>;
  }
  if (error) {
    console.error('Invitation loading error: ', error);
    return null;
  }

  const invitation = data.invitation;

  if (invitation === null) {
    return <Redirect to="/" />;
  }

  return (
    <Layout>
      <div className="w-100 invitation-page">
        <Container className="d-md-table">
          <Container className="h-100 d-md-table-cell align-middle">
            <Row className="pt-lg-3 pt-5 align-items-center">
              <Col lg="6">
                <div className="text-super pt-4">Hello,</div>
                <div className="text-super pb-lg-5 pb-3 invitation-page-influencer">{invitation.firstName}</div>
                <div className="invitation-page-separator" />
                <div className="text-headline pt-4" data-test-id="invitation-page-welcome-message">
                  {invitation.welcomeMessage}
                </div>
              </Col>
              <Col lg="6" className="pt-5 pt-lg-0 pb-4 pb-lg-0">
                <div className="invitation-page-right-block p-4 p-md-5">
                  <div className="d-table w-100">
                    <a
                      href="/"
                      className="btn btn-ochre btn-with-arrows d-table-cell align-middle w-100 invitation-page-create-btn"
                      onClick={() => loginWithRedirect({ page_type: 'sign_up' })}
                    >
                      Sign Up
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Container>
      </div>
    </Layout>
  );
}
