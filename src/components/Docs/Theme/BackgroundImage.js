import React from 'react'

import {
    Card, CardBody
} from 'reactstrap'

export default () => {
    return (
        <div id="backgroundimage" className="docs-item element">
            <h5 className="text-uppercase mb-4">Background image</h5>
            <div className="docs-desc">
                <p className="lead">Utility class that turns a <code>&lt;img className="bg-image"&gt;</code> into a background image for its background. Useful e.g. for carousels. Make sure that image's parent container and the content that should be placed over the image are relatively positioned.</p>
            </div>
            <div className="mt-5">
                <Card className="border-0 position-relative py-6 overflow-hidden shadow">
                    <img src="/content/img/photo/restaurant-1504087697492-238a6bf49ce8.jpg" alt="" className="bg-image" />
                    <CardBody className="text-center position-relative">
                        <h3 className="text-white text-uppercase mb-0">I have a background image</h3>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}