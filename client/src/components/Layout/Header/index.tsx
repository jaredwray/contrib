import React, { useCallback, useContext } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { Container, Image, Row, Col, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Logo from 'src/assets/images/logo-with-text.svg';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { mergeUrlPath } from 'src/helpers/mergeUrlPath';

import MenuNavLink from './MenuNavLink';
import './styles.scss';

export default function Header() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { account } = useContext(UserAccountContext);

  const afterLoginUri = mergeUrlPath(process.env.REACT_APP_PLATFORM_URL, '/after-login');

  const handleLogin = useCallback(() => loginWithRedirect({ redirectUri: afterLoginUri }), [
    loginWithRedirect,
    afterLoginUri,
  ]);

  const handleLogout = useCallback(() => logout({ federated: true }), [logout]);

  return (
    <header className="p-0 pl-sm-4 pr-sm-4 navigation-header">
      <Container fluid>
        <Row className="top">
          <Col md className="p-0">
            <Navbar collapseOnSelect expand={false}>
              <Link to="/">
                <img alt="Contrib" src={Logo} />
              </Link>

              <NavDropdown className="header-nav-dropdown" id="headerNavDropdown" title="">
                <section className="nav-dropdown-menu text-subhead">
                  {isAuthenticated && (
                    <>
                      <div className="dropdown-menu-user-name d-inline-block break-word">{user.name}</div>
                      <Image
                        roundedCircle
                        className="dropdown-menu-user-picture float-right d-inline-block"
                        src={user.picture}
                      />
                    </>
                  )}

                  {account?.isAdmin && (
                    <>
                      <MenuNavLink link="/admin/influencers" title="Manage Influencers" />
                      <MenuNavLink link="/admin/charities" title="Manage Charities" />
                    </>
                  )}

                  {account?.influencerProfile && <MenuNavLink link="/profiles/me" title="Account" />}

                  {account?.influencerProfile && <MenuNavLink link="/assistants/me" title="My assistants" />}

                  {account?.assistant && (
                    <MenuNavLink link={`/profiles/${account.assistant.influencerId}`} title="Account" />
                  )}

                  {(account?.influencerProfile || account?.assistant) && (
                    <MenuNavLink link="/auctions/new" title="Create new Auction" />
                  )}
                  {account && <NavDropdown.Divider />}

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
                    {/*
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
                    */}
                    <div className="pt-4">
                      <div className="text-label text-all-cups dropdown-menu-copyright">
                        Copyright {new Date().getFullYear()} Contrib Inc.
                      </div>

                      <div className="dropdown-menu-privacy text-label text-all-cups">
                        <Link to="/privacy-policy">Privacy</Link>
                        &#160;and&#160;
                        <Link to="/terms">Terms</Link>
                        &#160;&gt;&gt;
                      </div>
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
