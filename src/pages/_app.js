import React from 'react'
import Layout from '../components/Layout'
import { Provider } from 'next-auth/client'

import 'leaflet/dist/leaflet.css'
import 'react-image-lightbox/style.css'
import '../scss/style.default.scss'

export default ({ Component, pageProps }) => {
  return (
    <Provider session={pageProps.session}>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}