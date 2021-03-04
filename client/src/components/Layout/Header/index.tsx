import React, { useCallback, useContext } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { Container, Image, Row, Col, Navbar, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import Logo from 'src/assets/images/logo-with-text.svg';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { mergeUrlPath } from 'src/helpers/mergeUrlPath';

import './styles.scss';

export default function Header() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { permissions } = useContext(UserAccountContext);

  const afterLoginUri = mergeUrlPath(process.env.REACT_APP_PLATFORM_URL, '/after-login');

  const handleLogin = useCallback(() => loginWithRedirect({ redirectUri: afterLoginUri }), [
    loginWithRedirect,
    afterLoginUri,
  ]);

  const handleLogout = useCallback(() => logout(), [logout]);

  return (
    <header className="pl-4 pr-4">
      <Container fluid>
        <Row className="top">
          <Col md className="p-0">
            <Navbar collapseOnSelect expand={false}>
              <Navbar.Brand href="/">
                <img alt="Contrib" src={Logo} />
              </Navbar.Brand>

              <NavDropdown className="header-nav-dropdown" id="headerNavDropdown" title="">
                <section className="nav-dropdown-menu text-subhead">
                  {isAuthenticated && (
                    <>
                      <div className="dropdown-menu-user-name d-inline-block">{user.name}</div>
                      <Image
                        roundedCircle
                        className="dropdown-menu-user-picture float-right d-inline-block"
                        src={user.picture}
                      />
                    </>
                  )}

                  {permissions.includes('influencers:manage') && (
                    <NavLink to="/admin/influencers">
                      <NavDropdown.Item href="/admin/influencers">
                        <span>Manage Influencers</span>
                      </NavDropdown.Item>
                    </NavLink>
                  )}
                  {permissions.includes('influencer') && (
                    <NavLink to="/profile">
                      <NavDropdown.Item href="/profile">
                        <span>Account</span>
                      </NavDropdown.Item>
                    </NavLink>
                  )}

                  <NavLink to="/">
                    <NavDropdown.Item href="/">
                      <span>Bids</span>
                    </NavDropdown.Item>
                  </NavLink>
                  <NavLink to="/">
                    <NavDropdown.Item href="/">
                      <span>Watch list</span>
                    </NavDropdown.Item>
                  </NavLink>
                  <NavLink to="/">
                    <NavDropdown.Item href="/">
                      <span>Purchase history</span>
                    </NavDropdown.Item>
                  </NavLink>
                  <NavLink to="/">
                    <NavDropdown.Item href="/">
                      <span>Manage auctions</span>
                    </NavDropdown.Item>
                  </NavLink>

                  <NavDropdown.Divider />

                  {isAuthenticated ? (
                    <NavDropdown.Item data-test-id="dropdown-menu-logout-button" onClick={handleLogout}>
                      <span>Sign Out</span>
                    </NavDropdown.Item>
                  ) : (
                    <NavDropdown.Item data-test-id="dropdown-menu-login-button" onClick={handleLogin}>
                      <span>Log In</span>
                    </NavDropdown.Item>
                  )}
                  <div>
                    <div className="dropdown-menu-social-media pt-4 pb-2">
                      <a className="twitter d-inline-block mr-4" href="/" rel="external">
                        <i className="d-none" />
                      </a>
                      <a className="instagram d-inline-block mr-4" href="/" rel="external">
                        <i className="d-none" />
                      </a>
                      <a className="facebook d-inline-block" href="/" rel="external">
                        <i className="d-none" />
                      </a>
                    </div>
                    <div>
                      <div className="text-label text-all-cups dropdown-menu-copyright">
                        Copyright {new Date().getFullYear()} Contrib Inc.
                      </div>
                      <a className="dropdown-menu-privacy text-label text-all-cups" href="/">
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
