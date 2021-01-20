import Footer from './Footer'
import Header from './Header'
import Home from './Home'

import 'bootstrap/dist/css/bootstrap.min.css'

export default function App() {
  return (
    <div>
      <Header/>
      <main role='main'>
        <Home/>
      </main>
      <Footer/>
    </div>
  )
}
