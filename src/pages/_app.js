import React from 'react'
import Layout from '../components/Layout'

import 'leaflet/dist/leaflet.css'
import 'react-image-lightbox/style.css'
import '../scss/style.default.scss'


// This default export is required in a new `pages/_app.js` file.
export default ({ Component, pageProps }) => {
  return (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
  )
}