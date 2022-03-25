import { useCallback } from 'react';

import { useCookies } from 'react-cookie';

import { Auction } from 'src/types/Auction';

const COOKIES_MAX_AGE_SEC = 86400; // one day

export const usePrivateAuction = (auction: Auction) => {
  const [cookies, setCookie] = useCookies([auction?.id]);
  const passwordEncrypted = btoa(auction?.password || '');

  const hasAccess = (value?: string) => {
    if (!auction || !auction.password) return false;
    if (value) return btoa(value) === passwordEncrypted;

    return cookies[auction.id] === passwordEncrypted;
  };

  const giveAccess = useCallback(() => {
    if (!auction) return;

    setCookie(auction.id, passwordEncrypted, { secure: true, maxAge: COOKIES_MAX_AGE_SEC });
  }, [auction, setCookie, passwordEncrypted]);

  return {
    hasAccess,
    giveAccess,
  };
};
