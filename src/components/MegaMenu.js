import Router from 'next/router'
import Link from 'next/link'
import {
    NavItem,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Row,
    Col,
    Badge
} from 'reactstrap'
import UseWindowSize from '../hooks/UseWindowSize'

import menu from '../data/menu.json'

const MegaMenu = (props) => {
    const size = UseWindowSize()
    const [parentName, setParentName] = React.useState(false)
    const [dropdownOpen, setDropdownOpen] = React.useState({})
    const [dropdownAnimate, setDropdownAnimate] = React.useState(false)

    // highlight not only active dropdown item, but also its parent, i.e. dropdown toggle
    const highlightDropdownParent = () => {
        menu.map(item => {
            item.dropdown && item.dropdown.map(dropdownLink => {
                dropdownLink.link && dropdownLink.link === Router.route && setParentName(item.title)
                dropdownLink.links && dropdownLink.links.map(link => link.link === Router.route && setParentName(item.title))
            }
            )
            item.megamenu && item.megamenu.map(megamenuColumn =>
                megamenuColumn.map(megamenuBlock =>
                    megamenuBlock.links.map(dropdownLink => {
                        if (dropdownLink.link === Router.route) {
                            dropdownLink.parent ? setParentName(dropdownLink.parent) : setParentName(item.title)
                        }
                    })
                )
            )
            item.link === Router.route && setParentName(item.title)
        })
    }

    React.useEffect(highlightDropdownParent, [])
    
    const onLinkClick = (parent) => {
        size.width < 991 && setCollapsed(!collapsed)
        setParentName(parent)
    }

    const toggleDropdown = (name) => {
        setDropdownOpen({ ...dropdownOpen, [name]: !dropdownOpen[name] })
    }

    return menu && menu.map(item =>
        item.dropdown || item.megamenu ?
            // show entire menu to unlogged user or hide items that have hideToLoggedUser set to true
            !props.loggedUser || (props.loggedUser && !item.hideToLoggedUser) ?
                <Dropdown
                    nav
                    inNavbar
                    key={item.title}
                    className={item.position ? `position-${item.position}` : ``}
                    isOpen={dropdownOpen[item.title]}
                    toggle={() => toggleDropdown(item.title)}
                >
                    <DropdownToggle
                        nav
                        caret
                        onClick={() => setDropdownAnimate({ ...dropdownAnimate, [item.title]: !dropdownOpen[item.title] })}
                        className={parentName === item.title ? 'active' : ''}
                    >
                        {item.title}
                    </DropdownToggle>
                    <DropdownMenu className={`${dropdownAnimate[item.title] === false ? 'hide' : ''} ${item.megamenu ? 'megamenu py-lg-0' : ''}`}>
                        {item.dropdown &&
                            item.dropdown.map(dropdownItem =>
                                dropdownItem.links ?
                                    <React.Fragment key={dropdownItem.title}>
                                        <h6 className="dropdown-header font-weight-normal">
                                            {dropdownItem.title}
                                        </h6>
                                        {dropdownItem.links.map(link =>
                                            <Link key={link.title} activeClassName="active" href={link.link} passHref>
                                                <DropdownItem onClick={() => onLinkClick(item.title)}>
                                                    {link.title}
                                                    {link.new &&
                                                        <Badge color="info-light" className="ml-1 mt-n1">New</Badge>
                                                    }
                                                </DropdownItem>
                                            </Link>
                                        )}
                                    </React.Fragment>
                                    :
                                    <Link key={dropdownItem.title} activeClassName="active" href={dropdownItem.link} passHref>
                                        <DropdownItem onClick={() => onLinkClick(item.title)}>
                                            {dropdownItem.title}
                                            {dropdownItem.new &&
                                                <Badge color="info-light" className="ml-1 mt-n1">New</Badge>
                                            }
                                        </DropdownItem>
                                    </Link>
                            )
                        }
                        {item.megamenu &&
                            <Row className="p-3 pr-lg-0 pl-lg-5 pt-lg-5">
                                {item.megamenu.map((megamenuItem, index) =>
                                    <Col key={index} lg="2">
                                        {megamenuItem.map((block, index) =>
                                            <React.Fragment key={index}>
                                                <h6 className="text-uppercase">{block.title}</h6>
                                                <ul className="megamenu-list list-unstyled">
                                                    {block.links.map(link =>
                                                        <li
                                                            key={link.title}
                                                            className="megamenu-list-item">
                                                            <Link activeClassName="active" href={link.link} as={link.as} passHref>
                                                                <DropdownItem className="megamenu-list-link" onClick={() => link.parent ? onLinkClick(link.parent) : onLinkClick(item.title)}>
                                                                    {link.title}
                                                                    {link.new &&
                                                                        <Badge color="info-light" className="ml-1 mt-n1">New</Badge>
                                                                    }
                                                                </DropdownItem>
                                                            </Link>
                                                        </li>
                                                    )}
                                                </ul>
                                            </React.Fragment>
                                        )}
                                    </Col>
                                )}
                            </Row>
                        }
                    </DropdownMenu>
                </Dropdown>
                :
                ''
            :
            props.loggedUser && !item.hideToLoggedUser || !props.loggedUser ?
                <NavItem
                    key={item.title}
                    className={item.button ? 'mt-3 mt-lg-0 ml-lg-3 d-lg-none d-xl-inline-block' : ''}>
                    {item.button ?
                        item.showToLoggedUser !== false && <Link activeClassName="active" href={item.link}><a className='btn btn-primary' onClick={() => onLinkClick(item.title)}>{item.title}</a></Link>
                        :
                        <Link activeClassName="active" href={item.link} passHref><NavLink onClick={() => onLinkClick(item.title)}>{item.title}</NavLink></Link>
                    }
                </NavItem>
                :
                ''
    );
}

export default MegaMenu;