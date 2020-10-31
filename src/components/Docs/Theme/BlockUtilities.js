import React from 'react'

import {
    Card, CardBody, CardText
} from 'reactstrap'

export default () => {
    return (
        <div id="blockutilities" className="docs-item element">
            <h5 className="text-uppercase mb-4">Block utilities</h5>
            <div className="docs-desc"><p className="lead">Additional utility classes, for block elements mostly.</p></div>
            <div className="mt-5">          
                <Card className="bg-gray-100 border-0">
                  <CardBody> 
                    <h6 className="text-muted text-uppercase font-weight-normal mb-3">Class reference</h6>
                    <CardText><code>.bg-gray-100</code> to <code>.bg-gray-900</code> - grayscale backgrounds</CardText>
                    <CardText><code>.bg-primary-light</code>, <code>.bg-secondary-light</code> - lighter backgrounds for the theme colours</CardText>
                    <CardText><code>.opacity-1</code> to <code>.opacity-9</code> - opacity helper</CardText>
                    <CardText><code>.hover-scale</code> - scale element on hover</CardText>
                    <CardText><code>.hover-animate</code> - move element up by few pixels on hover</CardText>
                    <CardText><code>.hover-scale-bg-image</code> - scale element's background picture on hover</CardText>
                  </CardBody>
                </Card>
              </div>
        </div>
    )
}