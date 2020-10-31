import React from 'react'
import Link from 'next/link'
import * as Scroll from 'react-scroll'

import {
    Container,
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
    Nav
} from 'reactstrap'

import DocsNav from '../../components/Docs/DocsNav'

import Accordion from '../../components/Docs/Theme/Accordion'
import Avatar from '../../components/Docs/Theme/Avatar'
import Cards from '../../components/Docs/Theme/Cards'
import Gallery from '../../components/Docs/Theme/Gallery'
import IconsDirectory from '../../components/Docs/Theme/IconsDirectory'
import IconsFontAwesome from '../../components/Docs/Theme/IconsFontAwesome'
import Maps from '../../components/Docs/Theme/Maps'
import ReactSelect from '../../components/Docs/Theme/ReactSelect'
import Ribbon from '../../components/Docs/Theme/Ribbon'
import Swiper from '../../components/Docs/Theme/Swiper'

import BackgroundImage from '../../components/Docs/Theme/BackgroundImage'
import ImageOverlay from '../../components/Docs/Theme/ImageOverlay'
import ResponsiveBorders from '../../components/Docs/Theme/ResponsiveBorders'
import BlockUtilities from '../../components/Docs/Theme/BlockUtilities'
import TextUtilities from '../../components/Docs/Theme/TextUtilities'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "Theme Components"
        },
    }
}

export default () => {
    const ScrollLink = Scroll.Link

    const scrollLinkProps = {
        offset: -100,
        spy: true,
        smooth: true,
        activeClass: "active",
        className: "nav-link",
        href: "#"
    }
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
                            Theme Components
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <h1 className="hero-heading">Theme Components</h1>
                    <Row>
                        <Col xl="8" className="col-xl-8 mx-auto">
                            <p className="lead text-muted">
                                This is a quick showcase of some of the main Bootstrap components that come with this template.
                            </p>
                        </Col>
                    </Row>
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
                            className="docs-content position-relative"
                        >
                                <Accordion />
                                <Cards />
                                <Gallery />
                                <Maps />
                                <ReactSelect />
                                <Swiper />

                                <Avatar />                
                                <BackgroundImage />
                                <IconsDirectory />
                                <IconsFontAwesome />
                                <ImageOverlay />
                                <Ribbon />
                                <ResponsiveBorders />
                                <BlockUtilities />
                                <TextUtilities />
                        </Col>
                        <Col lg="2">
                            <Nav pills style={{ top: "120px" }} className="flex-column sticky-top ml-1 p-3 mb-5 border-left">
                                <h6 className="sidebar-heading ml-3">React components</h6>
                                {sidebarMenu.map(item =>
                                    item.divider ?
                                    <h6 key={item.label} className="sidebar-heading mt-3 ml-3">{item.label}</h6>
                                    :
                                    <ScrollLink key={item.label} to={item.to} {...scrollLinkProps}>{item.label}</ScrollLink>
                                )}
                            </Nav>
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    )
}

const sidebarMenu = [
    {
        "label": "Accordion",
        "to": "accordion"
    },
    {
        "label": "Cards",
        "to": "cards"
    },
    {
        "label": "Gallery with lightbox",
        "to": "gallerywithlightbox"
    },
    {
        "label": "Maps",
        "to": "maps"
    },
    {
        "label": "React Select",
        "to": "react-select"
    },
    {
        "label": "Swiper",
        "to": "swiper"
    },
    {
        "label": "CSS components",
        "divider": true
    },
    {
        "label": "Avatar",
        "to": "avatar"
    },    
    {
        "label": "Background image",
        "to": "backgroundimage"
    },
    {
        "label": "Icons - directory",
        "to": "icons-directory"
    },
    {
        "label": "Icons - Font Awesome",
        "to": "icons-fontawesome"
    },    
    {
        "label": "Image overlay",
        "to": "imageoverlay"
    },
    {
        "label": "Ribbon",
        "to": "ribbon"
    },    
    {
        "label": "Responsive borders",
        "to": "responsiveborders"
    },
    {
        "label": "Block utilities",
        "to": "blockutilities"
    },
    {
        "label": "Text utilities",
        "to": "textutilities"
    }
]