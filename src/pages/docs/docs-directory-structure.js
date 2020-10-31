import React from 'react'
import Link from 'next/link'

import {
    Container,
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap'

import DocsNav from '../../components/Docs/DocsNav'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "Docs introduction"
        },
    }
}

export default () => {
    return (
        <React.Fragment>
            <section className="hero py-5 py-lg-7">
                <Container className="position-relative">
                    <Breadcrumb listClassName="justify-content-center pl-0">
                        <BreadcrumbItem>
                            <Link href="/">
                                <a>Home</a>
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Link href="/docs/docs-introduction">
                                <a>Documentation</a>
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Directory structure
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <h1 className="hero-heading">Directory structure</h1>
                </Container>
            </section>
            <section className="py-6">
                <Container fluid>
                    <Row className="px-xl-5">
                        <Col lg="2">
                            <DocsNav />
                        </Col>
                        <Col
                            lg="10"
                            xl="8"
                            className="docs-content"
                        >
                            <div id="pagesfolder" className="docs-item">
                                <h5 className="text-uppercase mb-4">Src folder</h5>
                                <div className="docs-desc"></div>
                                <div className="mt-5">
                                    <p>All the theme files are located in <code>/src</code> folder. Files here form a demo static site, mostly equivalent to the online demo (CDNs not used here).</p>
                                    <p>Next.js uses folder and file name based routing. If you place file named <code>about.js</code> to <code>/src/pages</code> folder, page with <code>/about</code> URL will be created. You can also use subfolders (for example <code>/src/pages/blog/post.js</code> - final URL <code>/blog/post</code>).</p>
                                    <p> You can open any of the files in your code editor to modiy their markup or content to suit your needs.</p>
                                    <p><strong>Src folder also includes these subfolders:</strong></p>
                                    <ul>
                                        <li><code>/scss</code> - where you can find all scss files</li>
                                        <li><code>/components</code> - React components</li>
                                        <li><code>/hooks</code> - custom reusable React hooks</li>
                                        <li><code>/pages</code> - files for every page</li>
                                        <li><code>/data</code> - JSON data sample files for pages and components</li>
                                    </ul>
                                </div>
                            </div>
                            <div id="scssfolder" className="docs-item">
                                <h5 className="text-uppercase mb-4">SCSS folder</h5>
                                <div className="docs-desc"></div>
                                <div className="mt-5">
                                    <p> SCSS folder located at <code>/src/scss</code>, contains Bootstrap’s and theme’s SCSS sources structured in the following subfolders</p>
                                    <ul>
                                        <li><code>bootstrap</code> - full SCSS source for the Bootstrap framework.</li>
                                        <li><code>modules</code> - theme overrides and custom components for this theme</li>
                                        <li><code>style.*.scss</code> - main theme SCSS files that get compiled into theme main stylesheets style.*.css. The * represents the colour variant</li>
                                        <li><code>core.scss</code> - file that handles all the SASS imports - mixins, Bootstrap and theme variables, Bootstrap framework</li>
                                        <li><code>user.scss</code> - a place for you to add your own custom CSS declarations to keep them separate from the core theme files, which aids updating.</li>
                                        <li><code>user-variables.scss</code> - a place for you to add your own custom SCSS variables to override the Bootstrap and theme defaults. This prevents the need to edit the core Bootstrap/theme files and prevents the problems from updating the theme.</li>
                                    </ul>
                                </div>
                            </div>
                            <div id="publicfolder" className="docs-item">
                                <h5 className="text-uppercase mb-4">Public folder</h5>
                                <div className="docs-desc"></div>
                                <div className="mt-5">
                                    <p>Static files like images or SVG files are located in <code>/public/content</code> folder.</p>
                                    <p>You can customize <code>favicon</code> in <code>/public</code> folder too.</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    )
}