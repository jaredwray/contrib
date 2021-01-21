import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'

import Logo from './logo.svg'

import './Header.scss'

export default function Header() {
  return (
    <header>
      <Navbar collapseOnSelect expand={false}>
        <Navbar.Brand href="/">
          <img src={Logo} alt="Contrib" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="hamburger-menu">
          <div className="menu-icon"/>
        </Navbar.Toggle>
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link href="/">Log in</Nav.Link>
            <Nav.Link href="/">Sign up</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}
