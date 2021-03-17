import Layout from 'src/components/Layout';

import AboutUs from './AboutUs';
import Banner from './Banner';
import EndingSoon from './EndingSoon';
import Testimonials from './Testimonials';

export default function HomePage() {
  return (
    <Layout>
      <Banner />
      <AboutUs />
      <EndingSoon />
      <Testimonials />
    </Layout>
  );
}
