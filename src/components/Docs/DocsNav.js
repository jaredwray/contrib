import React from 'react'

import {
    Nav,
    NavLink
} from 'reactstrap'

import ActiveLink from '../ActiveLink'

export default () => {
    return (
        <div style={{ top: "120px" }} className="sticky-top mb-5">
            <div className="sidebar-block">
                <h6 className="sidebar-heading ml-3">Documentation</h6>
                <Nav tag="nav" pills className="flex-column">
                    <ActiveLink activeClassName="active" href="/docs/docs-introduction" passHref>
                        <NavLink className="mb-2">Introduction</NavLink>
                    </ActiveLink>
                    <ActiveLink activeClassName="active" href="/docs/docs-directory-structure" passHref>
                        <NavLink className="mb-2">Directory structure</NavLink>
                    </ActiveLink>
                    <ActiveLink activeClassName="active" href="/docs/docs-next" passHref>
                        <NavLink className="mb-2">Next.js</NavLink>
                    </ActiveLink>
                    <ActiveLink activeClassName="active" href="/docs/docs-customizing-css" passHref>
                        <NavLink className="mb-2">Customizing CSS</NavLink>
                    </ActiveLink>
                    <ActiveLink activeClassName="active" href="/docs/docs-credits" passHref>
                        <NavLink className="mb-2">Credits</NavLink>
                    </ActiveLink>
                    <ActiveLink activeClassName="active" href="/docs/docs-changelog" passHref>
                        <NavLink className="mb-2">Changelog</NavLink>
                    </ActiveLink>
                </Nav>
            </div>
            <div className="sidebar-block">
                <h6 className="sidebar-heading ml-3">Components</h6>
                <Nav tag="nav" pills className="flex-column">
                    <ActiveLink activeClassName="active" href="/docs/components-bootstrap" passHref>
                        <NavLink className="mb-2">Bootstrap</NavLink>
                    </ActiveLink>
                    <ActiveLink activeClassName="active" href="/docs/components-directory" passHref>
                        <NavLink className="mb-2">Theme</NavLink>
                    </ActiveLink>
                </Nav>
            </div>
        </div>
    )
}