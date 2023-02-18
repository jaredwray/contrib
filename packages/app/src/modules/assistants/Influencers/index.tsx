import { useState, useEffect, useContext } from 'react';

import { useLazyQuery } from '@apollo/client';

import { MyInfluencersListQuery } from 'src/apollo/queries/influencers';
import { PER_PAGE, BLANK_LIST_OBJECT } from 'src/components/custom/Pagination';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { AdminPage } from 'src/components/layouts/AdminPage';
import { setPageTitle } from 'src/helpers/setPageTitle';

import Items from './Items';

const Influencers = () => {
  const { account } = useContext(UserAccountContext);
  const [pageSkip, setPageSkip] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [getInfluencersList, { loading, data, error }] = useLazyQuery(MyInfluencersListQuery, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    getInfluencersList({
      variables: {
        size: PER_PAGE,
        skip: pageSkip,
        filters: { query: searchQuery },
        orderBy: 'STATUS_ASC',
      },
    });
  }, [getInfluencersList, searchQuery, pageSkip, account?.assistant?.influencerIds]);

  if (error) return null;

  const influencers = data?.myInfluencers || BLANK_LIST_OBJECT;

  setPageTitle('My Influencers page');

  return (
    <AdminPage
      items={influencers}
      loading={loading}
      pageSkip={pageSkip}
      setPageSkip={setPageSkip}
      onCancel={() => setSearchQuery('')}
      onChange={(value) => setSearchQuery(value)}
    >
      {influencers.items.length > 0 ? (
        <Items items={influencers.items} />
      ) : (
        <div className="pt-4">You don't have influencers</div>
      )}
    </AdminPage>
  );
};

export default Influencers;
