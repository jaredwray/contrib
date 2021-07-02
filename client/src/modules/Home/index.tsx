import Layout from 'src/components/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';

import AboutUs from './AboutUs';
import Banner from './Banner';
import EndingSoon from './EndingSoon';

export default function HomePage() {
  setPageTitle('Home page');

  return (
    <Layout>
      <Banner />
      <AboutUs />
      <EndingSoon />
      {/*<Testimonials />*/}
    </Layout>
  );
}
