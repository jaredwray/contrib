import React from 'react'

import Logo from './logo-light.svg'
import './Footer.scss'

export default function Footer() {
  return (
    <footer className="d-print-none" >
      <img src={Logo} alt="Contrib" />
      <div className="info">
        <div>Direct athlete-to-fan charity auctions.</div>
        <a href="/" >About Contrib</a>
      </div>
      <div className="social-media">
        <a href="/" className="twitter" rel="external"/>
        <a href="/" className="instagram" rel="external"/>
        <a href="/" className="facebook" rel="external"/>
      </div>

      <div className="bottom">
        <div className="text-uppercase copyright">Copyright {new Date().getFullYear()} Contrib Inc.</div>
        <a href="/" className="privacy">Privacy and Terms &gt;&gt;</a>
      </div>
    </footer>
  )
}
