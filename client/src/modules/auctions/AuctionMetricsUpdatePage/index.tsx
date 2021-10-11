import { FC, useCallback } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import { UpdateOrCreateAuctionMetricsMutation } from 'src/apollo/queries/auctions';
import { GetLinkQuery } from 'src/apollo/queries/shortLink';

const AuctionMetricsUpdatePage: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const history = useHistory();

  const { data } = useQuery(GetLinkQuery, {
    variables: { slug },
    onCompleted: ({ getLink }) => {
      redirect(getLink);
    },
  });

  const [updateMetrics] = useMutation(UpdateOrCreateAuctionMetricsMutation, {
    onCompleted: ({ updateOrCreateMetrics }) => {
      const auctionId = updateOrCreateMetrics?.id;
      if (!auctionId) {
        history.replace(`/404`);
        return;
      }
      goTo(data.getLink.link);
    },
  });

  const getUserData = useCallback(async () => {
    const responce = await fetch('https://ipapi.co/json/');
    const { country } = await responce.json();

    return { country, referrer: document.referrer || 'direct' };
  }, []);

  const goTo = useCallback(
    (link) => {
      const url = new URL(link);
      const incomingHost = url.host;
      const currentHost = document.location.host;

      if (incomingHost === currentHost) {
        history.push(url.pathname);
        return;
      }

      window.location.href = link;
    },
    [history],
  );

  const redirect = useCallback(
    (data) => {
      try {
        if (data.entity === 'auction') {
          getUserData().then(({ country, referrer }) => {
            updateMetrics({ variables: { shortLinkId: data.id, country, referrer } });
          });
        }
        goTo(data.link);
      } catch {
        history.replace(`/404`);
      }
    },
    [getUserData, updateMetrics, goTo, history],
  );

  return null;
};

export default AuctionMetricsUpdatePage;
