import React from 'react'
import Layout from 'src/components/Layout'
import { Provider } from 'next-auth/client'
import 'src/scss/style.default.scss'

const App = ({ Component, pageProps }) => {
  return (
    <Provider session={pageProps.session}>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export default App