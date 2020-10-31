import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import Gallery from '../../../components/Gallery'

export default () => {
    const highlightCode =
        `import Gallery from '../components/Gallery'

import data from 'data.json'

export default () => {
    return (
        <Gallery
            rowClasses="ml-n1 mr-n1"
            lg="4"
            xs="6"
            colClasses="px-1 mb-2"
            data={data.gallery}
                                
        />
    )
}`
    return (
        <div id="gallerywithlightbox" className="docs-item element">
            <h5 className="text-uppercase mb-4">Gallery with lightbox</h5>
            <div className="docs-desc">
                <p className="lead">
                    A simple gallery using the React Image Lightbox as the lightbox.
                </p>
                <p>
                    React Image Lightbox is a responsive lightbox &amp; dialog script with focus on performance and providing best experience for user with any device.
                </p>
                <p>
                    <a href="https://frontend-collective.github.io/react-image-lightbox/">Visit plugin website</a>
                </p>
                <p className="mt-4">
                    <b>Supported props for Gallery component:</b>
                </p>
                <ul>
                    <li><b>rowClasses</b> - classes for <code>Row</code> element</li>
                    <li><b>colClasses</b> - classes for <code>Col</code> element</li>
                    <li><b>data</b> - images object</li>
                    <li><b>xs</b> - extra small column size</li>
                    <li><b>sm</b> - small column size</li>
                    <li><b>md</b> - medium column size</li>
                    <li><b>lg</b> - large column size</li>
                    <li><b>xl</b> - extra large column size</li>
                </ul>
            </div>
            <div className="col-12 mt-5">
                <Gallery
                    rowClasses="align-items-center text-center mb-5"
                    lg="4"
                    xs="6"
                    colClasses="px-1 mb-2"
                    data={images}
                />
            </div>
            <div className="mt-3">
                <SyntaxHighlighter language="javascript" className="rounded shadow p-4" style={tomorrow}>
                    {highlightCode}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

const images = [
    {
        "img": "restaurant-1515164783716-8e6920f3e77c.jpg",
        "title": ""
    },
    {
        "img": "restaurant-1466978913421-dad2ebd01d17.jpg",
        "title": ""
    },
    {
        "img": "restaurant-1477763858572-cda7deaa9bc5.jpg",
        "title": ""
    },
    {
        "img": "restaurant-1505275350441-83dcda8eeef5.jpg",
        "title": ""
    },
    {
        "img": "restaurant-1508766917616-d22f3f1eea14.jpg",
        "title": ""
    },
    {
        "img": "restaurant-1430931071372-38127bd472b8.jpg",
        "title": ""
    }
]