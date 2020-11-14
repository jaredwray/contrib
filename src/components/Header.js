import React from 'react'
import Link from 'next/link'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Container,
    Form,
    Label,
    Input,
    Button,
} from 'reactstrap'

import Logo from '../../public/content/svg/logo.svg'

import userMenu from '../data/user-menu.json'
import MegaMenu from './MegaMenu'

const Header = props => {
    const [collapsed, setCollapsed] = React.useState(false)
    const [dropdownOpen, setDropdownOpen] = React.useState({})
    const [searchFocus, setSearchFocus] = React.useState(false)
    const [dropdownAnimate, setDropdownAnimate] = React.useState(false)

    const onFocus = () => setSearchFocus(!searchFocus)

    const toggleDropdown = (name) => {
        setDropdownOpen({ ...dropdownOpen, [name]: !dropdownOpen[name] })
    }

    return (
        <header className={`header ${props.headerClasses ? props.headerClasses : ''}`}>
            <Navbar
                color={props.nav.color ? props.nav.color : "white"}
                light={props.nav.light && true}
                dark={props.nav.dark && true}
                fixed={props.nav.fixed ? props.nav.fixed : "top"}
                expand="lg"
                className={props.nav.classes ? props.nav.classes : ""}>
                <Container fluid={true}>
                    <div className="d-flex align-items-center">
                        <Link href="/" passHref>
                            <a className="py-1 navbar-brand">
                                <img src={Logo} alt="Contrib logo" />
                            </a>
                        </Link>
                    </div>
                    <NavbarToggler
                        onClick={() => setCollapsed(!collapsed)}
                        className="navbar-toggler-right">
                        <i className="fa fa-bars"></i>

                    </NavbarToggler>
                    <Collapse isOpen={collapsed} navbar>
                        {/* mobile search form */}
                        <Form
                            id="searchcollapsed"
                            className="form-inline mt-4 mb-2 d-sm-none">
                            <div className={`input-label-absolute input-label-absolute-left input-reset w-100 ${searchFocus ? 'focus' : ''}`}>
                                <Label
                                    for="searchcollapsed_search"
                                    className="label-absolute">
                                    <i className="fa fa-search"></i>

                                    <span className="sr-only">
                                        What are you looking for?
                                    </span>
                                </Label>
                                <Input
                                    id="searchcollapsed_search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    bsSize="sm"
                                    className="border-0 shadow-0 bg-gray-200"
                                    onFocus={onFocus}
                                    onBlur={() => setTimeout(() => onFocus(), 333)}/>
                                <Button
                                    type="reset"
                                    size="sm"
                                    color="deoco"
                                    className="btn-reset">
                                    <i className="fas fa-times"></i>
                                </Button>
                            </div>
                        </Form>
                        <Nav navbar className="ml-auto">
                            <MegaMenu />
                            {props.loggedUser && userMenu && userMenu.map(item =>
                                <Dropdown
                                    nav
                                    inNavbar
                                    key={item.title}
                                    className={item.type === "avatar" ? "ml-lg-3" : ""}
                                    isOpen={dropdownOpen[item.title]}
                                    toggle={() => toggleDropdown(item.title)}
                                >
                                    <DropdownToggle
                                        nav
                                        style={item.type === "avatar" && { padding: 0 }}
                                        onClick={() => setDropdownAnimate({ ...dropdownAnimate, [item.title]: !dropdownOpen[item.img] })}
                                    >
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
                            )}
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </header >
    )
};

export default Header;