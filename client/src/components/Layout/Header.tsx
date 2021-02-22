import React, { useContext } from 'react';
import { Container, Image, Row, Col, Navbar, NavDropdown } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';

import Logo from './logo.svg';

import './Header.scss';
import { UserAccountContext } from '../UserAccountProvider/UserAccountContext';

export default function Header() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { permissions } = useContext(UserAccountContext);

  return (
    <header className="pl-4 pr-4">
      <Container fluid>
        <Row className="top">
          <Col md className="p-0">
            <Navbar collapseOnSelect expand={false}>
              <Navbar.Brand href="/">
                <img src={Logo} alt="Contrib" />
              </Navbar.Brand>
              <NavDropdown title="" id="headerNavDropdown" className="header-nav-dropdown">
                <section className="nav-dropdown-menu text-subhead">
                  {isAuthenticated && (
                    <>
                      <div className="dropdown-menu-user-name d-inline-block">{user.name}</div>
                      <Image
                        className="dropdown-menu-user-picture float-right d-inline-block"
                        src={user.picture}
                        roundedCircle
                      />
                    </>
                  )}
                  {permissions.includes('influencers:manage') && (
                    <NavDropdown.Item href="/admin/influencers">
                      <span>Manage Influencers</span>
                    </NavDropdown.Item>
                  )}
                  {permissions.includes('influencer') && (
                    <NavDropdown.Item href="/profile">
                      <span>Account</span>
                    </NavDropdown.Item>
                  )}

                  <NavDropdown.Item href="/">
                    <span>Bids</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/">
                    <span>Watch list</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/">
                    <span>Purchase history</span>
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/">
                    <span>Manage auctons</span>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  {isAuthenticated ? (
                    <NavDropdown.Item data-test-id="dropdown-menu-logout-button" onClick={() => logout()}>
                      <span>Sign Out</span>
                    </NavDropdown.Item>
                  ) : (
                    <NavDropdown.Item data-test-id="dropdown-menu-login-button" onClick={() => loginWithRedirect()}>
                      <span>Log In</span>
                    </NavDropdown.Item>
                  )}
                  <div>
                    <div className="dropdown-menu-social-media pt-4 pb-2">
                      <a href="/" className="twitter d-inline-block mr-4" rel="external">
                        <i className="d-none" />
                      </a>
                      <a href="/" className="instagram d-inline-block mr-4" rel="external">
                        <i className="d-none" />
                      </a>
                      <a href="/" className="facebook d-inline-block" rel="external">
                        <i className="d-none" />
                      </a>
                    </div>
                    <div>
                      <div className="text-label text-all-cups dropdown-menu-copyright">
                        Copyright {new Date().getFullYear()} Contrib Inc.
                      </div>
                      <a href="/" className="dropdown-menu-privacy text-label text-all-cups">
                        Privacy and Terms &gt;&gt;
                      </a>
                    </div>
                  </div>
                </section>
              </NavDropdown>
            </Navbar>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
