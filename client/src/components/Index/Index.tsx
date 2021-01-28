import Layout from '../Layout/Layout'
import Banner from './Banner'
import AboutUs from './AboutUs'
import EndingSoon from './EndingSoon'
import Reviews from './Reviews'

import 'react-multi-carousel/lib/styles.css'
import './Index.scss'
import './MultiCarousel.scss'

export default function Index() {
  return (
    <Layout>
      <Banner/>
      <AboutUs/>
      <EndingSoon/>
      <Reviews/>
    </Layout>
  )
}
