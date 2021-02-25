import Layout from '../../components/Layout';
import Banner from './Banner';
import AboutUs from './AboutUs';
import EndingSoon from './EndingSoon';
import Reviews from './Reviews';

import 'react-multi-carousel/lib/styles.css';
import './styles.scss';
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
