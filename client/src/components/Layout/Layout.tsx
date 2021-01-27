import Footer from './Footer'
import Header from './Header'

import 'bootstrap/dist/css/bootstrap.min.css'

export default function Layout({children}: {children: any}) {
  return (
    <>
      <Header/>
      <main role='main'>{children}</main>
      <Footer/>
    </>
  )
}
