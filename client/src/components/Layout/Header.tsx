import React from 'react'
import { Container, Image, Row, Col, Navbar, NavDropdown } from 'react-bootstrap'

import Logo from './logo.svg'

import './Header.scss'

export default function Header() {
  return (
    <header className="pl-4 pr-4">
      <Container fluid>
        <Row className="top">
          <Col md className="p-0 pl-md-4">
            <Navbar collapseOnSelect expand={false}>
              <Navbar.Brand href="/">
                <img src={Logo} alt="Contrib" />
              </Navbar.Brand>
              <NavDropdown title={<div className="menu-icon"/>} id="basic-nav-dropdown">
                <section className="nav-dropdown-menu">
                  <div className="user-info">
                    <div className="name">Julian Strait</div>
                    <Image className="avatar" src="/content/img/users/avatar.png" roundedCircle />
                  </div>

                  <NavDropdown.Item href="/">Account</NavDropdown.Item>
                  <NavDropdown.Item href="/">Bids</NavDropdown.Item>
                  <NavDropdown.Item href="/">Watch list</NavDropdown.Item>
                  <NavDropdown.Item href="/">Purchase history</NavDropdown.Item>
                  <NavDropdown.Item href="/">Manage auctons</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/">Sign Out</NavDropdown.Item>

                  <div className="footer">
                    <div className="social-media">
                      <div className="pl-4 pt-4 pr-4 pb-2">
                        <a href="/" className="twitter d-inline-block mr-4" rel="external"><i className="d-none"/></a>
                        <a href="/" className="instagram d-inline-block mr-4" rel="external"><i className="d-none"/></a>
                        <a href="/" className="facebook d-inline-block" rel="external"><i className="d-none"/></a>
                      </div>
                    </div>
                    <div className="bottom pl-4 pr-4">
                      <div className="text-uppercase copyright">
                        Copyright {new Date().getFullYear()} Contrib Inc.
                      </div>
                      <a href="/" className="privacy text-uppercase">Privacy and Terms &gt;&gt;</a>
                    </div>
                  </div>
                </section>

              </NavDropdown>
            </Navbar>
          </Col>
        </Row>
      </Container>
    </header>
  )
}
