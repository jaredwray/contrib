import { useAuth0 } from '@auth0/auth0-react';

import { mergeUrlPath } from 'src/helpers/mergeUrlPath';
import { useShowNotification } from 'src/helpers/useShowNotification';

export const RedirectWithReturnAfterLogin = (redirectPath: string) => {
  const { loginWithRedirect } = useAuth0();
  const { showError } = useShowNotification();

  const redirectUri = mergeUrlPath(
    process.env.REACT_APP_PLATFORM_URL,
    `/after-login?returnUrl=${encodeURIComponent(redirectPath)}`,
  );
  loginWithRedirect({ redirectUri }).catch((error) => showError(error.message));
};
