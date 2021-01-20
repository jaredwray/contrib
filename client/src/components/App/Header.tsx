import React from 'react'
import { Nav, Navbar } from "react-bootstrap";

import Logo from '../../images/svg/logo.svg'
import HamburgerIcon from '../../images/icons/hamburger.png'

import '../../styles/Header.scss'

export default function Header() {
  return (
    <header className='header'>
      <Navbar collapseOnSelect expand={false}>
        <Navbar.Brand href="/">
          <img src={Logo} alt="Contrib" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="hamburgerMenu">
          <img src={HamburgerIcon} alt="Contrib" />
        </Navbar.Toggle>
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link href="#">Log in</Nav.Link>
            <Nav.Link href="#">Sign up</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}
