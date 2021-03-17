import Layout from 'src/components/Layout';

import AboutUs from './AboutUs';
import Banner from './Banner';
import EndingSoon from './EndingSoon';
import Reviews from './Reviews';

export default function HomePage() {
  return (
    <Layout>
      <Banner />
      <AboutUs />
      <EndingSoon />
      <Reviews />
    </Layout>
  );
}
