import { useHistory } from 'react-router-dom';

export const useRedirectWithReturnAfterLogin = () => {
  const history = useHistory();

  return (redirectPath: string) => {
    const redirectURL = `/log-in?returnURL=${redirectPath}`;
    history.replace(redirectURL);
  };
};
