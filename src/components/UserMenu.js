import Link from 'next/link'
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap'

import userMenu from '../data/user-menu.json'

const UserMenu = (props) => {
    const [dropdownOpen, setDropdownOpen] = React.useState({})
    const [dropdownAnimate, setDropdownAnimate] = React.useState(false)

    const toggleDropdown = (name) => {
        setDropdownOpen({ ...dropdownOpen, [name]: !dropdownOpen[name] })
    }

    return  userMenu && userMenu.map(item =>
        <Dropdown
            nav
            inNavbar
            key={item.title}
            className={item.type === "avatar" ? "ml-lg-3" : ""}
            isOpen={dropdownOpen[item.title]}
            toggle={() => toggleDropdown(item.title)}>
            <DropdownToggle
                nav
                style={item.type === "avatar" && { padding: 0 }}
                onClick={() => setDropdownAnimate({ ...dropdownAnimate, [item.title]: !dropdownOpen[item.img] })}>
                {item.type === "avatar" ?
                    <img src={`/content${item.img}`} alt={item.title} className="avatar avatar-sm avatar-border-white mr-2" />
                    :
                    item.title
                }
            </DropdownToggle>
            <DropdownMenu className={dropdownAnimate[item.title] === false ? 'hide' : ''} right>
                {item.dropdown &&
                    item.dropdown.map(dropdownItem =>
                        <Link key={dropdownItem.title} activeClassName="active" href={dropdownItem.link} passHref>
                            <DropdownItem onClick={() => onLinkClick(item.title)}>
                                {dropdownItem.title}
                            </DropdownItem>
                        </Link>
                    )}
            </DropdownMenu>
        </Dropdown>
    ) || ''
}

export default UserMenu;