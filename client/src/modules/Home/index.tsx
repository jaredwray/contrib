import Layout from 'src/components/layouts/Layout';

import Banner from './Banner';
import EndingSoon from './EndingSoon';

export default function HomePage() {
  return (
    <Layout>
      <Banner />
      <EndingSoon />
    </Layout>
  );
}
