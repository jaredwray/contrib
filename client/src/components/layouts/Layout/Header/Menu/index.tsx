import { FC, ReactElement, useCallback, useContext } from 'react';

import clsx from 'clsx';
import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { useAuth } from 'src/helpers/useAuth';

import MenuNavLink from './MenuNavLink';
import './dropdown.scss';
import styles from './styles.module.scss';

interface Props {
  avatar: ReactElement;
}

const Menu: FC<Props> = ({ avatar }) => {
  const { account } = useContext(UserAccountContext);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = useCallback(() => {
    const w = window as any;
    logout!(w.location.origin);
    w.Intercom('shutdown');
  }, [logout]);

  const dropdownIcon = <div className="d-none d-sm-block">{avatar}</div>;

  return (
    <NavDropdown
      className="header-nav-dropdown d-flex flex-grow-1 justify-content-start order-md-1 justify-content-sm-end"
      data-test-id="header-nav-dropdown"
      title={dropdownIcon}
    >
      <section className="nav-dropdown-menu px-3 py-4 text-center text-subhead">
        {isAuthenticated && (
          <>
            <div
              className={clsx(styles.userName, 'user-select-none d-inline-block break-word pb-4')}
              data-test-id="user-name"
            >
              {user?.name}
            </div>
            <MenuNavLink link="/profile" title="My Profile" />
            <MenuNavLink link="/my-bids" title="My Bids" />
          </>
        )}
        {account?.influencerProfile && (
          <>
            <MenuNavLink link="/profiles/me" title="My Account" />
            <MenuNavLink link="/assistants/me" title="My Assistants" />
          </>
        )}
        {account?.charity && <MenuNavLink link="/charity/me" title="My Charity Profile" />}
        {account?.assistant && <MenuNavLink link={'/my-influencers'} title="My Influencers" />}
        {account?.influencerProfile && <MenuNavLink link="/auctions/new" title="Create new Auction" />}

        <MenuNavLink link="/auctions" title="Auctions" />
        <MenuNavLink link="/influencers" title="Influencers" />
        <MenuNavLink link="/charities" title="Charities" />

        {account?.isAdmin && (
          <>
            <MenuNavLink link="/admin/auctions" title="Manage Auctions" />
            <MenuNavLink link="/admin/influencers" title="Manage Influencers" />
            <MenuNavLink link="/admin/charities" title="Manage Charities" />
            <MenuNavLink link="/admin/invitations" title="Manage Invitations" />
          </>
        )}

        <NavDropdown.Divider />

        {isAuthenticated ? (
          <NavDropdown.Item data-test-id="logout-button" onClick={handleLogout}>
            <span>Sign Out</span>
          </NavDropdown.Item>
        ) : (
          <MenuNavLink data-test-id="login-button" link="/log-in" title="Log In" />
        )}
        <div>
          <div className="pt-4 text-label">
            <div className={clsx(styles.copyright, 'user-select-none text-all-cups')}>
              &copy;{new Date().getFullYear()} Contrib Inc.
            </div>

            <div className={styles.privacy}>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <span className="user-select-none">&nbsp; &middot; &nbsp;</span>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </section>
    </NavDropdown>
  );
};

export default Menu;
