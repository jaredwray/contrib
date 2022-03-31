import { useCallback, useContext } from 'react';

import { Container, Image, Row, Col, Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Logo from 'src/assets/images/logo-with-text-white.svg';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { DEFAULT_AVATAR_PATH } from 'src/constants';
import { useAuth } from 'src/helpers/useAuth';

import MenuNavLink from './MenuNavLink';
import './styles.scss';

export default function Header() {
  const { account } = useContext(UserAccountContext);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = useCallback(() => {
    const w = window as any;
    logout!(w.location.origin);
    w.Intercom('shutdown');
  }, [logout]);

  return (
    <header className="p-0 px-sm-4 navigation-header">
      <Container className="p-0" fluid="xxl">
        <Row className="top px-0">
          <Col md className="p-0">
            <Navbar collapseOnSelect expand={false}>
              <NavDropdown className="flex-grow-1 header-nav-dropdown" id="headerNavDropdown" title="">
                <section className="nav-dropdown-menu px-3 py-4 text-center text-subhead">
                  {isAuthenticated && (
                    <>
                      <div className="dropdown-menu-user-name d-inline-block break-word">{user?.name}</div>
                      <Image
                        roundedCircle
                        className="dropdown-menu-user-picture float-end d-inline-block"
                        src={user?.picture || DEFAULT_AVATAR_PATH}
                      />
                      <MenuNavLink link="/profile" title="My Profile" />
                    </>
                  )}
                  <MenuNavLink link="/auctions" title="Auctions" />
                  <MenuNavLink link="/influencers" title="Influencers" />
                  <MenuNavLink link="/charities" title="Charities" />
                  {account?.isAdmin && (
                    <>
                      <MenuNavLink link="/admin/auctions" title="Manage Auctions" />
                      <MenuNavLink link="/admin/influencers" title="Manage Influencers" />
                      <MenuNavLink link="/admin/charities" title="Manage Charities" />
                    </>
                  )}
                  {account?.influencerProfile && (
                    <>
                      <MenuNavLink link="/profiles/me" title="My Account" />
                      <MenuNavLink link="/assistants/me" title="My Assistants" />
                    </>
                  )}
                  {account?.charity && <MenuNavLink link="/charity/me" title="My Charity Profile" />}
                  {account?.assistant && (
                    <MenuNavLink link={`/profiles/${account.assistant.influencerId}`} title="Account" />
                  )}
                  {(account?.influencerProfile || account?.assistant) && (
                    <MenuNavLink link="/auctions/new" title="Create new Auction" />
                  )}
                  <NavDropdown.Divider />
                  {isAuthenticated ? (
                    <NavDropdown.Item data-test-id="dropdown-menu-logout-button" onClick={handleLogout}>
                      <span>Sign Out</span>
                    </NavDropdown.Item>
                  ) : (
                    <MenuNavLink data-test-id="dropdown-menu-login-button" link="/log-in" title="Log In" />
                  )}
                  <div>
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
              <Link className="flex-grow-1 header-logo" to="/">
                <img alt="Contrib" src={Logo} />
              </Link>
              <Navbar className="p-0 desktop-navbar flex-grow-1">
                <Nav>
                  <Nav.Link className="px-3 py-2" href="/auctions">
                    Auctions
                  </Nav.Link>
                  <Nav.Link className="px-3 py-2" href="/influencers">
                    Influencers
                  </Nav.Link>
                  <Nav.Link className="px-3 py-2" href="/charities">
                    Charities
                  </Nav.Link>
                </Nav>
              </Navbar>
              <div className="flex-grow-1 header-login-profile-icon">
                {isAuthenticated ? (
                  <a href="/log-in" title="Log In">
                    <Image roundedCircle className="profile-icon" src={user?.picture || DEFAULT_AVATAR_PATH} />
                  </a>
                ) : (
                  <a href="/log-in" title="Log In">
                    <Image roundedCircle className="profile-icon" src={DEFAULT_AVATAR_PATH} />
                  </a>
                )}
              </div>
            </Navbar>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
