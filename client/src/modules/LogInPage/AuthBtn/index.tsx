import { FC, useCallback } from 'react';

import cslx from 'clsx';
import { Button } from 'react-bootstrap';

import { mergeUrlPath } from 'src/helpers/mergeUrlPath';
import { useAuth } from 'src/helpers/useAuth';

import styles from './styles.module.scss';

const ICON_STYLES_MAP: { [name: string]: string } = {
  facebook: styles.facebookBtn,
  twitter: styles.twitterBtn,
  google: styles.googleBtn,
  sms: styles.smsBtn,
};

interface Props {
  provider: string;
  text?: string;
  returnQuery: string;
}

const AuthBtn: FC<Props> = ({ provider, text, returnQuery }) => {
  const { loginWithRedirect } = useAuth();

  const btnText = text || provider[0].toUpperCase() + provider.slice(1);

  let afterLoginUri = mergeUrlPath(process.env.REACT_APP_PLATFORM_URL, '/after-login');

  if (returnQuery) afterLoginUri += `?returnURL=${returnQuery}`;

  const handleLogin = useCallback(() => {
    if (provider === 'sms') return;

    loginWithRedirect!({ redirectURL: afterLoginUri, provider });
  }, [loginWithRedirect, afterLoginUri, provider]);

  return (
    <div className={cslx(styles.authBtn, 'pt-2')} data-test-id="log_in" onClick={handleLogin}>
      <Button className={cslx(ICON_STYLES_MAP[provider], styles.icon)} />
      <Button className={cslx(styles.text, 'text-label text-left text-sm-center')} variant="secondary">
        Log In With {btnText}
      </Button>
    </div>
  );
};

export default AuthBtn;
