import React from 'react'
import Link from 'next/link'
import { Collapse, Navbar, Container } from 'reactstrap'
const Logo = require('public/content/svg/logo.svg') as string
import UserMenu from './UserMenu'

const Header = props => {
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
                    <div className="d-flex">
                        <Link href="/" passHref>
                            <a className="py-1 navbar-brand">
                                <img src={Logo} alt="Contrib logo" />
                            </a>
                        </Link>
                    </div>
                    <Collapse isOpen={true} >
                        <UserMenu user={props.loggedUser} />
                    </Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header