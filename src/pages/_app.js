import React from 'react'
import Layout from '../components/Layout'
import { Provider } from 'next-auth/client'

import '../scss/style.default.scss'


const App = ({ Component, pageProps }) => {
  return (
    <Provider session={pageProps.session}>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
};


// This default export is required in a new `pages/_app.js` file.
export default App;