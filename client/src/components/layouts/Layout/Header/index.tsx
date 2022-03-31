import { useCallback, useContext } from 'react';

import { Container, Image, Row, Col, Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Logo from 'src/assets/images/contrib-logo-horizontal-white.svg';
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
    <header className="p-0 px-sm-3 navigation-header">
      <Container className="p-0" fluid="xxl">
        <Row className="top px-0">
          <Col md className="p-0">
            <Navbar collapseOnSelect className="p-0" expand={false}>
              <NavDropdown className="flex-grow-1 header-nav-dropdown" id="headerNavDropdown" title="">
                <section className="nav-dropdown-menu px-3 py-4 text-center text-subhead">
                  {isAuthenticated && (
                    <>
                      <div className="dropdown-menu-user-name d-inline-block break-word pb-4">{user?.name}</div>
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
                        &copy;{new Date().getFullYear()} Contrib Inc.
                      </div>

                      <div className="dropdown-menu-privacy text-label">
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        &nbsp; &middot; &nbsp;
                        <Link to="/terms">Terms</Link>
                      </div>
                    </div>
                  </div>
                </section>
              </NavDropdown>
              <Link className="flex-grow-1 header-logo d-flex p-2 p-md-0" to="/">
                <img alt="Contrib" src={Logo} />
              </Link>
              <Navbar className="p-0 desktop-navbar flex-grow-1">
                <Nav>
                  <Nav.Link className="px-3 py-3" href="/auctions">
                    Auctions
                  </Nav.Link>
                  <Nav.Link className="px-3 py-3" href="/influencers">
                    Influencers
                  </Nav.Link>
                  <Nav.Link className="px-3 py-3" href="/charities">
                    Charities
                  </Nav.Link>
                </Nav>
              </Navbar>
              <div className="flex-grow-1 header-login-profile-icon">
                {isAuthenticated ? (
                  <Link className="d-flex justify-content-end" to="/profile">
                    <Image roundedCircle className="profile-icon" src={user?.picture || DEFAULT_AVATAR_PATH} />
                  </Link>
                ) : (
                  <Link to="/log-in">
                    <Image roundedCircle className="profile-icon" src={DEFAULT_AVATAR_PATH} />
                  </Link>
                )}
              </div>
            </Navbar>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
