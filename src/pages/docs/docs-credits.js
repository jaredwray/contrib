import React from 'react'
import Link from 'next/link'

import {
    Container,
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
    Badge
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
                            Credits
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <h1 className="hero-heading">Credits</h1>
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
                            <div id="credits" className="docs-item">
                                <h5 className="text-uppercase mb-4">Credits</h5>
                                <div className="docs-desc"></div>
                                <div className="mt-5">
                                    <ul>
                                        <li className="mb-3"><strong>Bootstrap</strong> - <a href="https://getbootstrap.com/">https://getbootstrap.com/</a></li>
                                        <li className="mb-3"><strong>ReactStrap</strong> - <a href="https://reactstrap.github.io/">https://reactstrap.github.io/</a></li>
                                        <li className="mb-3"><strong>React.js</strong> - <a href="https://reactjs.org/">https://reactjs.org/</a></li>
                                        <li className="mb-3"><strong>Next.js</strong> - <a href="https://nextjs.org/">https://nextjs.org/</a></li>
                                        <li className="mb-3"><strong>Google Fonts - Playfair Display</strong> - <a href="https://fonts.google.com/specimen/Playfair+Display">https://fonts.google.com/specimen/Playfair+Display</a></li>
                                        <li className="mb-3"><strong>Google Fonts - Poppins</strong> - <a href="https://fonts.google.com/specimen/Poppins">https://fonts.google.com/specimen/Poppins</a></li>
                                        <li className="mb-3"><strong>Orion Icons </strong> - <a href="https://orioniconlibrary.com">https://orioniconlibrary.com</a></li>
                                        <li className="mb-3"><strong>Font Awesome </strong> - <a href="http://fontawesome.io/get-started/">http://fontawesome.io/get-started/</a></li>
                                        <li className="mb-3"><strong>LeafletJS</strong> - <a href="https://leafletjs.com/">https://leafletjs.com/</a></li>
                                         <li className="mb-3"><strong>React Leaflet</strong> - <a href="https://react-leaflet.js.org/">https://react-leaflet.js.org/</a></li>
                                        <li className="mb-3"><strong>Next.js</strong> - <a href="https://nextjs.org/">https://nextjs.org/</a></li>
                                        <li className="mb-3"><strong>Swiper </strong> - <a href="http://idangero.us/swiper/">http://idangero.us/swiper/</a></li>
                                        <li className="mb-3"><strong>ReactIdSwiper </strong> - <a href="https://github.com/kidjp85/react-id-swiper">https://github.com/kidjp85/react-id-swiper</a></li>
                                        <li className="mb-3"><strong>NoUI Slider </strong> - <a href="https://refreshless.com/nouislider/">https://refreshless.com/nouislider/</a></li>
                                        <li className="mb-3"><strong>React NoUI Slider </strong> - <a href="https://github.com/mmarkelov/react-nouislider">https://github.com/mmarkelov/react-nouislider</a></li>
                                        <li className="mb-3"><strong>React Select</strong> - <a href="https://react-select.com/">https://react-select.com/</a></li>
                                        <li className="mb-3"><strong>React Image Lightbox</strong> - <a href="https://frontend-collective.github.io/react-image-lightbox/">https://frontend-collective.github.io/react-image-lightbox/</a></li>
                                        <li className="mb-3"><strong>React Dropzone</strong> - <a href="https://react-dropzone.js.org/">https://react-dropzone.js.org/</a></li>
                                        <li className="mb-3"><strong>React Dates</strong> - <a href="https://github.com/airbnb/react-dates">https://github.com/airbnb/react-dates</a></li>
                                        <li className="mb-3"><strong>Next.js Progressbar</strong> - <a href="https://github.com/apal21/nextjs-progressbar">https://github.com/apal21/nextjs-progressbar</a></li>
                                        <li className="mb-3"><strong>Next.js + Images</strong> - <a href="https://github.com/twopluszero/next-images">https://github.com/twopluszero/next-images</a></li>
                                        <li className="mb-3"><strong>Object-fit-images </strong> - <a href="https://github.com/bfred-it/object-fit-images">https://github.com/bfred-it/object-fit-images</a></li>
                                        <li className="mb-3"><strong>Demo images from Unsplash. See them in a collection. </strong> - <a href="https://unsplash.com/collections/3372734/directory">https://unsplash.com/collections/3372734/directory</a></li>
                                    </ul>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    )
}