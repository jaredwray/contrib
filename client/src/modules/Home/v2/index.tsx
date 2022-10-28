import { useQuery } from '@apollo/client';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import Layout from 'src/components/layouts/Layout';
import { AuctionStatus } from 'src/types/Auction';

import Banner from './Banner';
import EndingSoon from './EndingSoon';

export default function HomePage() {
  const { loading, data, error } = useQuery(AuctionsListQuery, {
    variables: {
      size: 25,
      orderBy: 'ENDING_SOON',
      filters: {
        status: [AuctionStatus.ACTIVE, AuctionStatus.SETTLED, AuctionStatus.SOLD],
      },
    },
  });

  if (loading || error) return null;

  let charities = new Set();

  data.auctions.items.forEach(
    (i: any) =>
      !charities.has(JSON.stringify(i)) && charities.add(JSON.stringify({ id: i.charity.id, name: i.charity.name })),
  );

  charities = new Set([...charities].map((o: any) => JSON.parse(o)));
  const charityItems = [...charities].map((charity: any, i: number) => <EndingSoon key={i} charity={charity} />);

  return (
    <Layout>
      <Banner />
      {charityItems}
    </Layout>
  );
}
