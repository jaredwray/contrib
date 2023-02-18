import { useHistory } from 'react-router-dom';

export const useRedirectWithReturnAfterLogin = () => {
  const history = useHistory();

  return (redirectPath: string) => {
    history.push(`/log-in?returnURL=${redirectPath}`);
  };
};
