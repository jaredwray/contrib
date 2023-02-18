/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
import { FC, useCallback } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import { UpdateOrCreateAuctionMetricsMutation } from 'src/apollo/queries/auctions';
import { GetLinkQuery } from 'src/apollo/queries/shortLink';

const ShortLinkPage: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const history = useHistory();

  useQuery(GetLinkQuery, {
    variables: { slug },
    /* istanbul ignore next */
    onCompleted: ({ getLink }) => {
      redirect(getLink);
    },
  });

  const [updateMetrics] = useMutation(UpdateOrCreateAuctionMetricsMutation);

  const getUserData = useCallback(async () => {
    const responce = await fetch('https://ipapi.co/json/');
    const { country } = await responce.json();
    const userAgentData = window.navigator.userAgent;

    return { country, referrer: document.referrer || 'direct', userAgentData };
  }, []);

  const goTo = useCallback(
    (link) => {
      const url = new URL(link);
      const incomingHost = url.host;
      const currentHost = document.location.host;

      if (incomingHost === currentHost) {
        history.replace(url.pathname);
        return;
      }

      window.location.href = link;
    },
    [history],
  );

  const redirect = useCallback(
    async (data) => {
      if (!data?.link) {
        history.replace(`/404`);
        return;
      }

      if (data.link.match(/\/auctions\/[0-9a-z]*$/g)) {
        try {
          const userData = await getUserData();
          await updateMetrics({ variables: { shortLinkId: data.id, ...userData } });
        } catch {}
      }

      goTo(data.link);
    },
    [getUserData, updateMetrics, goTo, history],
  );

  return null;
};

export default ShortLinkPage;
