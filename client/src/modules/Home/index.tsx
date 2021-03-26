import Layout from 'src/components/Layout';

import AboutUs from './AboutUs';
import Banner from './Banner';
import EndingSoon from './EndingSoon';

export default function HomePage() {
  return (
    <Layout>
      <Banner />
      <AboutUs />
      <EndingSoon />
      {/*<Testimonials />*/}
    </Layout>
  );
}
