import Layout from 'src/components/layouts/Layout';
import { useAuth } from 'src/helpers/useAuth';

import Banner from './Banner';
import EndingSoon from './EndingSoon';
import HowTo from './HowTo';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <Banner />
      <EndingSoon />
      {!isAuthenticated && <HowTo />}
    </Layout>
  );
}
