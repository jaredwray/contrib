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
                <section className="nav-dropdown-menu text-subhead">
                  <div>
                    <div className="dropdown-menu-user-name d-inline-block">Julian Strait</div>
                    <Image className="float-right d-inline-block" src="/content/img/users/avatar.png" roundedCircle />
                  </div>
                  <NavDropdown.Item href="/"><span>Account</span></NavDropdown.Item>
                  <NavDropdown.Item href="/"><span>Bids</span></NavDropdown.Item>
                  <NavDropdown.Item href="/"><span>Watch list</span></NavDropdown.Item>
                  <NavDropdown.Item href="/"><span>Purchase history</span></NavDropdown.Item>
                  <NavDropdown.Item href="/"><span>Manage auctons</span></NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/"><span>Sign Out</span></NavDropdown.Item>
                  <div>
                    <div className="dropdown-menu-social-media pt-4 pb-2">
                      <a href="/" className="twitter d-inline-block mr-4" rel="external"><i className="d-none"/></a>
                      <a href="/" className="instagram d-inline-block mr-4" rel="external"><i className="d-none"/></a>
                      <a href="/" className="facebook d-inline-block" rel="external"><i className="d-none"/></a>
                    </div>
                    <div>
                      <div className="text-label text-all-cups dropdown-menu-copyright">
                        Copyright {new Date().getFullYear()} Contrib Inc.
                      </div>
                      <a href="/" className="dropdown-menu-privacy text-label text-all-cups">Privacy and Terms &gt;&gt;</a>
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
