import React from 'react'

import {
    Card, CardBody, CardText
} from 'reactstrap'

export default () => {
    return (
        <div id="responsiveborders" className="docs-item element">
            <h5 className="text-uppercase mb-4">Responsive borders</h5>
            <div className="docs-desc">
                <p className="lead">
                    Responsive borders as an addition to Bootstrap's <a href="https://getbootstrap.com/docs/4.1/utilities/borders/">border utilities</a>.
                </p>
            </div>
            <div className="mt-5">
                <Card className="bg-gray-100 border-0">
                    <CardBody>
                        <h6 className="text-muted text-uppercase font-weight-normal mb-3">Class reference</h6>
                        <CardText><code>.border-sm</code>, <code>.border-md</code>, etc.</CardText>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}