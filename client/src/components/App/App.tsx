import Layout from '../Layout/Layout'
import Banner from './Banner'
import AboutUs from './AboutUs'
import EndingSoon from './EndingSoon'
import Reviews from './Reviews'

export default function App() {
  return (
    <>
      <Layout>
        <Banner/>
        <AboutUs/>
        <EndingSoon/>
        <Reviews/>
      </Layout>
    </>
  )
}
