import { useCallback, useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { GetInvitation } from 'src/apollo/queries/getInvitation';
import { UserDialogLayout } from 'src/components/layouts/UserDialogLayout';
import { mergeUrlPath } from 'src/helpers/mergeUrlPath';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';

import './styles.scss';

export default function InvitationPage() {
  const { slug } = useParams<{ slug: string }>();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const { loading, data, error } = useQuery(GetInvitation, { variables: { slug } });

  const history = useHistory();
  const invitation = data?.invitation;

  const handleSignUp = useCallback(() => {
    RedirectWithReturnAfterLogin(mergeUrlPath(process.env.REACT_APP_PLATFORM_URL, `/after-login?invite=${slug}`));
  }, [RedirectWithReturnAfterLogin, slug]);

  useEffect(() => {
    if (!loading && !invitation) history.push('/');
  }, [invitation, loading, error, history]);

  if (!invitation) return null;

  const textBlock = (
    <div className="text-headline pt-4" data-test-id="invitation-page-welcome-message">
      {invitation.welcomeMessage}
    </div>
  );

  setPageTitle('Invitation page');

  return (
    <UserDialogLayout textBlock={invitation.welcomeMessage && textBlock} title={`Welcome, ${invitation.firstName}!`}>
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
