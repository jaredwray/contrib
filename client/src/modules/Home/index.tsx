import Layout from 'src/components/layouts/Layout';
import { useAuth } from 'src/helpers/useAuth';

import Banner from './Banner';
import EndingSoon from './EndingSoon';
import HowTo from './HowTo';
import Status from './Status';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <Banner />
      <Status />
      <EndingSoon />
      {!isAuthenticated && <HowTo />}
    </Layout>
  );
}
