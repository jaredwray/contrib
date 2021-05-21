/* eslint-disable no-console */
import React, { useCallback, useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Row, Col } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { GetInvitation } from 'src/apollo/queries/getInvitation';
import Layout from 'src/components/Layout';
import { mergeUrlPath } from 'src/helpers/mergeUrlPath';

import './styles.scss';

export default function InvitationPage() {
  const { loginWithRedirect } = useAuth0();
  const { slug } = useParams<{ slug: string }>();

  const { loading, data, error } = useQuery(GetInvitation, {
    variables: { slug: slug },
  });

  const history = useHistory();

  const invitation = data?.invitation;

  const handleSignUp = useCallback(() => {
    loginWithRedirect({
      redirectUri: mergeUrlPath(process.env.REACT_APP_PLATFORM_URL, `/after-login?invite=${slug}`),
    }).catch((error) => {
      console.error('login with redirect error: ', error);
    });
  }, [loginWithRedirect, slug]);

  useEffect(() => {
    if (!loading && !invitation) {
      history.push('/');
    }
  }, [invitation, loading, error, history]);

  if (!invitation) {
    return null;
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
              <Col className="pt-5 pt-lg-0 pb-4 pb-lg-0" lg="6">
                <div className="invitation-page-right-block p-4 p-md-5">
                  <div className="d-table w-100">
                    <a
                      className="btn btn-ochre btn-with-arrows d-table-cell align-middle w-100 invitation-page-create-btn"
                      href="/"
                      onClick={handleSignUp}
                    >
                      {invitation.accepted ? 'Log in' : 'Sign Up'}
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
