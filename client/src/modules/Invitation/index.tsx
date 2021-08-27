/* eslint-disable no-console */
import React, { useCallback, useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { GetInvitation } from 'src/apollo/queries/getInvitation';
import { UserDialogLayout } from 'src/components/UserDialogLayout';
import { mergeUrlPath } from 'src/helpers/mergeUrlPath';
import { setPageTitle } from 'src/helpers/setPageTitle';

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
      page_type: invitation.accepted ? 'log_in' : 'sign_up',
      redirectUri: mergeUrlPath(process.env.REACT_APP_PLATFORM_URL, `/after-login?invite=${slug}`),
    }).catch((error) => {
      console.error('login with redirect error: ', error);
    });
  }, [loginWithRedirect, slug, invitation]);

  useEffect(() => {
    if (!loading && !invitation) {
      history.push('/');
    }
  }, [invitation, loading, error, history]);

  if (!invitation) {
    return null;
  }
  const textBlock = (
    <div className="text-headline pt-4" data-test-id="invitation-page-welcome-message">
      {invitation.welcomeMessage}
    </div>
  );
  setPageTitle('Invitation page');

  return (
    <UserDialogLayout subtitle={invitation.firstName} textBlock={textBlock} title="Hello,">
      <Button
        className="btn-with-arrows d-table-cell align-middle w-100 invitation-page-create-btn"
        variant="ochre"
        onClick={handleSignUp}
      >
        {invitation.accepted ? 'Log in' : 'Sign Up'}
      </Button>
    </UserDialogLayout>
  );
}
