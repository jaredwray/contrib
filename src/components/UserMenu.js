import Link from 'next/link'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { signOut } from 'next-auth/client'

const UserMenu = (props) => {
    const [dropdownOpen, setDropdownOpen] = React.useState({})
    const [dropdownAnimate, setDropdownAnimate] = React.useState(false)

    const toggleDropdown = (name) => {
        setDropdownOpen({ ...dropdownOpen, [name]: !dropdownOpen[name] })
    }

    const user = props.user
    const title = 'user'

    return user &&
        <Dropdown
            nav
            inNavbar
            key={title}
            className="ml-lg-3"
            isOpen={dropdownOpen[title]}
            toggle={() => toggleDropdown(title)}>
            <DropdownToggle
                nav
                style={{ padding: 0 }}
                onClick={() => setDropdownAnimate({ ...dropdownAnimate, [title]: !dropdownOpen[user.image] })}>
                <img src={user.image} alt={user.name} title={user.name} className="avatar avatar-sm avatar-border-white mr-2" />
            </DropdownToggle>
            <DropdownMenu className={dropdownAnimate[title] === false ? 'hide' : ''} right>
                <Link key="userMenu-profile" activeClassName="active" href="/user/profile" passHref>
                    <DropdownItem onClick={() => onLinkClick("Profile")}>
                    <b>{user.name}</b>
                    </DropdownItem>
                </Link>
                <Link key="userMenu-account" activeClassName="active" href="/user/account" passHref>
                    <DropdownItem onClick={() => onLinkClick("Account")}>
                        Account
                    </DropdownItem>
                </Link>
                <hr/>
                <Link key="userMenu-bids" activeClassName="active" href="/user/account" passHref>
                    <DropdownItem onClick={() => onLinkClick("Bids")}>
                        Bids
                    </DropdownItem>
                </Link>
                <Link key="userMenu-watchlist" activeClassName="active" href="/user/account" passHref>
                    <DropdownItem onClick={() => onLinkClick("Watch list")}>
                        Watch list
                    </DropdownItem>
                </Link>
                <Link key="userMenu-purchases" activeClassName="active" href="/user/account" passHref>
                    <DropdownItem onClick={() => onLinkClick("Purchase history")}>
                        Purchase history
                    </DropdownItem>
                </Link>
                <hr />
                <Link key="userMenu-auctions" activeClassName="active" href="/user-list" passHref>
                    <DropdownItem onClick={() => onLinkClick("Manage auctions")}>
                       Manage auctions
                    </DropdownItem>
                </Link>
                <hr/>
                <Link key="signout" activeClassName="active" href="/" passHref>
                    <DropdownItem onClick={() => signOut()}>
                        Sign out
                    </DropdownItem>
                </Link>
            </DropdownMenu>
        </Dropdown>
    || ''
}

export default UserMenu;