import React from 'react'

import {
    Card, CardBody, Row, Col, CardText
} from 'reactstrap'

export default () => {
    return (
        <div id="imageoverlay" className="docs-item element">
            <h5 className="text-uppercase mb-4">Image overlay</h5>
            <div className="docs-desc">
                <p className="lead">
                    Utility class that darkens or lightens the backround image of the element to enhance the legibility. It can be used with cards, carousel slides, etc.
                </p>
                <p>
                    Gradient overlay adds vertical gradient that's darkest on the bottom third of the element.
                    </p>
            </div>
            <div className="mt-5">
                <Row>
                    <Col lg="6">
                        <Card className="mb-5 border-0 text-white dark-overlay shadow-lg">
                            <img src="/content/img/photo/photo-1467987506553-8f3916508521.jpg" alt="" className="card-img" />
                            <a href="/category" className="tile-link" />
                            <div className="card-img-overlay d-flex align-items-center">
                                <div className="w-100 overlay-content">
                                    <h2 className="text-center mb-0">Dark overlay</h2>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col lg="6">
                        <Card className="mb-5 border-0 text-center light-overlay shadow-lg">
                            <img src="/content/img/photo/photo-1514890547357-a9ee288728e0.jpg" alt="" className="card-img" />
                            <a href="/category" className="tile-link" />
                            <div className="card-img-overlay d-flex align-items-center">
                                <div className="w-100 overlay-content">
                                    <h2 className="text-center mb-0">Light overlay </h2>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col lg="6">
                        <Card className="card mb-5 border-0 text-center gradient-overlay shadow-lg">
                            <img src="/content/img/photo/photo-1514890547357-a9ee288728e0.jpg" alt="" className="card-img" />
                            <a href="/category" className="tile-link" />
                            <div className="card-img-overlay-bottom z-index-20 text-white">
                                <h2 className="h5 card-text">Gradient Overlay</h2>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Card className="bg-gray-100 border-0">
                    <CardBody>
                        <h6 className="text-muted text-uppercase font-weight-normal mb-3">Class reference</h6>
                        <CardText><code>.dark-overlay</code>, <code>.light-overlay</code>,  <code>.gradient-overlay</code>  - CSS class to be used on the element</CardText>
                        <CardText><code>.overlay-content</code> - use this class on the element's content to increase its Z-index and move it above the overlay layer</CardText>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}