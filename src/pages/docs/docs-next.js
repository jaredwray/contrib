import React from 'react'
import Link from 'next/link'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

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
            title: "Next.js"
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
                            Next.js
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <h1 className="hero-heading">Next.js</h1>
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
                            <div id="gettingstarted" className="docs-item">
                                <h5 className="text-uppercase mb-4">Getting started</h5>

                                <div className="docs-desc"><p>This theme uses zero configuration <a href="https://nextjs.org/">Next.js</a> framework which is based on React, Webpack and Babel. It allows you to make blazing fast web applications with possibility of server side rendering.</p></div>
                                <div className="mt-5">

                                    <h6 className="text-uppercase mb-4">Biggest advantages</h6>
                                    <ul>
                                        <li><strong>Pre-Rendering</strong> - Statically generated and server-rendered React applications have never been easier.</li>
                                        <li><strong>Static Exporting</strong> -  Exporting a static site with Next.js is as easy as a single command.</li>
                                        <li><strong>Zero Configuration</strong> - Automatic code splitting, filesystem based routing, hot code reloading and universal rendering.</li>
                                        <li><strong>Fully Extensible</strong> - Complete control over Babel and Webpack. Customizable server, routing and next-plugins.</li>
                                        <li><strong>Optimized & Ready for Production</strong> - Optimized for a smaller build size, faster dev compilation and dozens of other improvements.</li>
                                    </ul>
                                    <p>Find out more about Next.js at <a href="https://nextjs.org/">its website</a>.</p>
                                </div>

                                <hr className="my-5" />

                                <div>
                                    <p className="mb-5">To use this theme, all you need to do is to install Node, theme's dependencies, and you're good to go.</p>
                                    <h6 className="text-uppercase mb-4">1. Install Node</h6>
                                    <p className="text-muted mb-5">If you don't have Node installed on your machine, head to <a href="https://nodejs.org/en/download/">its official site</a> and choose an appropriate installation for your system.</p>
                                    <h6 className="text-uppercase mb-4">2. Install project's dependencies</h6>
                                    <p className="text-muted mb-4">This will install dependencies from theme's <code>package.json</code> file.</p>
                                    <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4 mb-5">
                                        {`$ npm install`}
                                    </SyntaxHighlighter>
                                    <h6 className="text-uppercase mb-4">3. Run development enviroment</h6>
                                    <p className="text-muted mb-4">This will run a development task for Next.js. You're all set. </p>
                                    <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4 mb-5">
                                        {`$ npm run dev`}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                            <div id="development" className="docs-item">
                                <h5 className="text-uppercase mb-4">Development</h5>
                                <div className="docs-desc"><p>Running <code>npm run dev</code> in the theme's folder will start a local server instance on port 3000 to serve and refresh your pages as you edit.</p></div>
                            </div>
                            <div id="staticexport" className="docs-item">
                                <h5 className="text-uppercase mb-4">Static Export</h5>
                                <div className="docs-desc"><p>Running <code>npm run export</code> in the theme's folder makes <code>/out</code> folder with a static export of your website. Read more about Static HTML exports <a href="https://nextjs.org/docs/advanced-features/static-html-export">here</a>.</p></div>
                            </div>
                            <div id="deployment" className="docs-item">
                                <h5 className="text-uppercase mb-4">Deployment</h5>
                                <div className="docs-desc"><p>The easiest way to deploy your Next.js project is using <a href="https://vercel.com/">Vercel platform</a>. More about deploying Next.js and other hosting options <a href="https://nextjs.org/docs/deployment">here</a>.</p></div>
                            </div>
                            <div id="productionbuild" className="docs-item">
                                <h5 className="text-uppercase mb-4">Production build</h5>
                                <div className="docs-desc"><p>Running <code>npm run build</code> in the theme's folder makes <code>/.next</code> folder with optimized production build. Read more about production build <a href="https://nextjs.org/docs/api-reference/cli#build">here</a>.</p></div>
                            </div>
                            <div id="data" className="docs-item">
                                <h5 className="text-uppercase mb-4">Data + Data Fetching</h5>
                                <div className="docs-desc">
                                    <p>Theme uses static JSON files to feed data to the pages and components. You can fetch your own data from headless CMS or API. You can also simply edit sample JSON files located at <code>/src/data</code> folder for easy content editing.</p>
                                    <p>Find out more about data fetching <a href="https://nextjs.org/docs/basic-features/data-fetching">here</a>.</p>
                                </div>
                            </div>
                            <div id="static" className="docs-item">
                                <h5 className="text-uppercase mb-4">Routing</h5>
                                <div className="docs-desc">
                                    <h6 className="text-dark">File-system Based Router</h6>
                                    <p>Next.js has a file-system based router built on the <a href="https://nextjs.org/docs/basic-features/pages">concept of pages</a>.</p>
                                    <p>When a file is added to the pages directory it's automatically available as a route.</p>
                                    <p className="mb-4">The files inside the pages directory can be used to define most common patterns.</p>
                                    <h6 className="text-dark">Dynamic Routing</h6>
                                    <p>Defining routes by using predefined paths is not always enough for complex applications. In Next.js you can add brackets to a page ([param]) to create a dynamic route (a.k.a. url slugs, pretty urls, and others).</p>
                                    <p>We demonstrate this concept in <code>blog/[slug].js</code>, see it live <Link href="/blog"><a>here</a></Link>.</p>
                                    <p>Based on a blog.json file containing data about all our blog posts (simulating access to API), we create all blog post URLs, and their content during the build time. The main functions to achieve this behavior are <code>getStaticPaths</code> (<a href="https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation">docs</a>) and  <code>getStaticProps</code> (<a href="https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation">docs</a>). More about Dynamic Routes <a href="https://nextjs.org/docs/routing/dynamic-routes">here</a>.</p>
                                </div>
                            </div>
                            <div id="css_support" className="docs-item">
                                <h5 className="text-uppercase mb-4">Built-In CSS Support
</h5>
                                <div className="docs-desc">
                                    <p>Next.js allows you to import CSS files from a JavaScript file. This is possible because Next.js extends the concept of import beyond JavaScript.</p>
                                    <p>Find out more about working with CSS in Next.js <a href="https://nextjs.org/docs/basic-features/built-in-css-support">here</a>.</p>
                                </div>
                            </div>                            

                            
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    )
}