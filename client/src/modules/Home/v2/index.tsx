import { useQuery } from '@apollo/client';
import clsx from 'clsx';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import Layout from 'src/components/layouts/Layout';
import { useAuth } from 'src/helpers/useAuth';
import { Auction, AuctionStatus } from 'src/types/Auction';

import Banner from './Banner';
import EndingSoon from './EndingSoon';
import HowTo from './HowTo';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { loading, data, error } = useQuery(AuctionsListQuery, {
    variables: {
      size: 25,
      orderBy: 'ENDING_SOON',
      filters: {
        status: [AuctionStatus.ACTIVE],
      },
    },
  });

  if (loading || error) return null;

  const charities = new Set();
  data.auctions.items.forEach((i: any) => charities.add({ id: i.charity.id, name: i.charity.name }));
  const charityItems = [...charities].map((charity: any, i: number) => <EndingSoon key={i} charity={charity} />);

  return (
    <Layout>
      <Banner />
      {charityItems}
      {!isAuthenticated && <HowTo />}
    </Layout>
  );
}
