import Layout from 'src/components/layouts/Layout';

import Banner from './Banner';
import EndingSoon from './EndingSoon';
import Status from './Status';

export default function HomePage() {
  return (
    <Layout>
      <Banner />
      <Status />
      <EndingSoon />
    </Layout>
  );
}
