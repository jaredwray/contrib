import React from 'react'

import {
    Row,
    Col
} from 'reactstrap'

export default () => {
    return (
        <div id="avatar" className="docs-item element">
            <h5 className="text-uppercase mb-4">Avatar</h5>
            <div className="docs-desc">
                <p className="lead">Custom classes to format your user images. You can combine avatar classes with padding utility class to give to the image a nice white border.</p>
            </div>
            <div className="mt-5">
                <Row className="align-items-center text-center mb-5">
                    <Col xs="auto">
                        <img alt="Image" src="/content/img/avatar/avatar-0.jpg" className="avatar mb-3 avatar-xxl p-2" />
                        <code className="d-block">.avatar-xxl p-2</code>
                    </Col>
                    <Col xs="auto">
                        <img alt="Image" src="/content/img/avatar/avatar-1.jpg" className="avatar mb-3 avatar-xxl" />
                        <code className="d-block">.avatar-xxl</code>
                    </Col>
                    <Col xs="auto"><img alt="Image" src="/content/img/avatar/avatar-2.jpg" className="avatar mb-3 avatar-xl" />
                        <code className="d-block">.avatar-xl</code>
                    </Col>
                    <Col xs="auto">
                        <img alt="Image" src="/content/img/avatar/avatar-3.jpg" className="avatar mb-3 avatar-lg" />
                        <code className="d-block">.avatar-lg</code>
                    </Col>
                    <Col xs="auto">
                        <img alt="Image" src="/content/img/avatar/avatar-4.jpg" className="avatar mb-3 avatar" />
                        <code className="d-block">.avatar</code>
                    </Col>
                    <Col xs="auto">
                        <img alt="Image" src="/content/img/avatar/avatar-5.jpg" className="avatar mb-3 avatar-sm" />
                        <code className="d-block">.avatar-sm</code>
                    </Col>
                </Row>
            </div>
        </div>
    )
}