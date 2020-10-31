import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Container,
    Collapse,
    Button,
    Form,
    Input
} from 'reactstrap'


export default () => {
    const [open, setOpen] = React.useState({})

    const toggle = (name, value) => {
        setOpen({ ...open, [name]: value ? value : !open[name] })
    }

    return (

        <div id="navbar" className="docs-item element">
            <h5 className="text-uppercase mb-4">Navbar</h5>
            <div className="docs-desc"><p className="lead"> Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse plugin. See the <a href="https://reactstrap.github.io/components/navbar/">ReactStrap documentation</a> for more details. </p></div>
            <div className="mt-5">
                <Navbar expand="lg" light className="shadow mb-3">
                    <Container fluid>
                        <NavbarBrand href="/" className="text-uppercase font-weight-bold"><span>Directory  </span></NavbarBrand>
                        <NavbarToggler aria-label="Toggle navigation" onClick={() => toggle("navbar")} ><i className="fa fa-bars" /></NavbarToggler>
                        <Collapse navbar isOpen={open["navbar"]}>
                            <Nav navbar className="mr-auto">
                                <NavItem className="active"><a href="#" className="nav-link">Home <span className="sr-only">(current)</span></a></NavItem>
                                <NavItem><a href="#" className="nav-link">Link</a></NavItem>
                                <Dropdown isOpen={open["navbar-dropdown"]} toggle={() => toggle("navbar-dropdown")} nav inNavbar>
                                    <DropdownToggle caret nav>Dropdown</DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem href="#">Action</DropdownItem>
                                        <DropdownItem href="#">Another action</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem href="#">Something else here</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                <NavItem><NavLink href="#" disabled>Disabled</NavLink></NavItem>
                            </Nav>
                            <Form inline className="my-2 my-lg-0">
                                <Input type="search" placeholder="Search" aria-label="Search" className="mr-sm-2" />
                                <Button type="submit" color="outline-primary" className="my-2 my-sm-0">Search</Button>
                            </Form>
                        </Collapse>
                    </Container>
                </Navbar>
                <Navbar expand="lg" light className="shadow mb-3">
                    <Container fluid>
                        <NavbarBrand href="/"><span className="font-weight-bold text-uppercase">Directory  </span></NavbarBrand>
                        <NavbarToggler aria-label="Toggle navigation" onClick={() => toggle("navbar-2")} ><i className="fa fa-bars" /></NavbarToggler>
                        <Collapse navbar isOpen={open["navbar-2"]}>
                            <Nav navbar className="mx-auto">
                                <NavItem className="active"><a href="#" className="nav-link">Home <span className="sr-only">(current)</span></a></NavItem>
                                <NavItem><a href="#" className="nav-link">Link</a></NavItem>
                                <Dropdown isOpen={open["navbar-dropdown-2"]} toggle={() => toggle("navbar-dropdown-2")} nav inNavbar>
                                    <DropdownToggle caret nav>Dropdown</DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem href="#">Action</DropdownItem>
                                        <DropdownItem href="#">Another action</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem href="#">Something else here</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Nav>
                            <div className="right-col d-flex align-items-center justify-content-between justify-content-lg-end my-3 my-lg-0">
                                <NavItem tag="div" className="navbar-icon-link">
                                    <svg className="svg-icon">
                                        <use xlinkHref="/content/svg/orion-svg-sprite.svg#search-1" />
                                    </svg>
                                </NavItem>
                                <NavItem tag="div" className="user">
                                    <a href="#" className="navbar-icon-link">
                                        <svg className="svg-icon">
                                            <use xlinkHref="/content/svg/orion-svg-sprite.svg#male-user-1" />
                                        </svg>
                                        <span className="text-sm ml-2 ml-lg-0 text-uppercase text-sm font-weight-bold d-none d-sm-inline d-lg-none">
                                            Log in
                                        </span>
                                    </a>
                                </NavItem>
                            </div>
                        </Collapse>
                    </Container>
                </Navbar>
                <Navbar expand="lg" dark className="shadow bg-dark mb-3">
                    <Container fluid>
                        <NavbarBrand href="/"><span className="font-weight-bold text-uppercase">Directory  </span></NavbarBrand>
                        <NavbarToggler aria-label="Toggle navigation" onClick={() => toggle("navbar-3")} ><i className="fa fa-bars" /></NavbarToggler>
                        <Collapse navbar isOpen={open["navbar-3"]}>
                            <Nav navbar className="mx-auto">
                                <NavItem className="active"><NavLink href="#">Home <span className="sr-only">(current)</span></NavLink></NavItem>
                                <NavItem><NavLink href="#">Link</NavLink></NavItem>
                                <Dropdown isOpen={open["navbar-dropdown-3"]} toggle={() => toggle("navbar-dropdown-3")} nav inNavbar>
                                    <DropdownToggle caret nav>Dropdown</DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem href="#">Action</DropdownItem>
                                        <DropdownItem href="#">Another action</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem href="#">Something else here</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Nav>
                            <div className="right-col d-flex align-items-center justify-content-between justify-content-lg-end my-3 my-lg-0">
                                <NavItem tag="div" className="navbar-icon-link">
                                    <svg className="svg-icon">
                                        <use xlinkHref="/content/svg/orion-svg-sprite.svg#search-1" />
                                    </svg>
                                </NavItem>
                                <NavItem tag="div" className="user">
                                    <a href="#" className="navbar-icon-link">
                                        <svg className="svg-icon">
                                            <use xlinkHref="/content/svg/orion-svg-sprite.svg#male-user-1" />
                                        </svg>
                                        <span className="text-sm ml-2 ml-lg-0 text-uppercase text-sm font-weight-bold d-none d-sm-inline d-lg-none">
                                            Log in
                                        </span>
                                    </a>
                                </NavItem>
                            </div>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
            <div className="mt-4">
                <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                    {highlightCode}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

const highlightCode =
    `import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Container } from 'reactstrap'

export default () => {
    const [navOpen, setNavOpen] = React.useState(false)
    const [dropdownOpen, setDropdownOpen] = React.useState(false)
    
    return (
        <Navbar expand="lg" light>
            <Container fluid>
                <NavbarBrand href="/"><span>Directory  </span></NavbarBrand>
                <NavbarToggler aria-label="Toggle navigation" onClick={() => setNavOpen(!navOpen)} ><i className="fa fa-bars" /></NavbarToggler>
                <Collapse navbar isOpen={navOpen}>
                    <Nav navbar className="mr-auto">
                        <NavItem className="active">
                            <NavLink href="#">Home <span className="sr-only">(current)</span></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#">Link</NavLink>
                        </NavItem>
                        <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)} nav inNavbar>
                            <DropdownToggle caret nav>Dropdown</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem href="#">Action</DropdownItem>
                                <DropdownItem href="#">Another action</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem href="#">Something else here</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <NavItem>
                            <NavLink href="#" disabled>Disabled</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    )
}`