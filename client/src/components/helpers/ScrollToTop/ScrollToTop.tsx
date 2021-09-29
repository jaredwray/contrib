import { useEffect, FC } from 'react';

import { useLocation } from 'react-router';

export const ScrollToTop: FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
