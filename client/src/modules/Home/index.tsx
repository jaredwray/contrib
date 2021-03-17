import Layout from 'src/components/Layout';

import AboutUs from './AboutUs';
import Banner from './Banner';
import EndingSoon from './EndingSoon';
import Reviews from './Reviews';

import 'react-multi-carousel/lib/styles.css';
import './MultiCarousel.scss';

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
