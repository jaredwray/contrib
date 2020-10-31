import React from 'react'

import {
  Card, CardBody, CardText
} from 'reactstrap'

export default () => {
  return (
    <div id="textutilities" className="docs-item element">
      <h5 className="text-uppercase mb-4">Text utilities</h5>
      <div className="docs-desc"><p className="lead">Additional utility classes, for block elements mostly.</p></div>
      <div className="mt-5">
        <Card className="bg-gray-100 border-0">
          <CardBody>
            <h6 className="text-muted text-uppercase font-weight-normal mb-3">Class reference</h6>
            <CardText><code>.text-gray-100</code> to <code>.text-gray-900</code> - grayscale text colours</CardText>
            <CardText><code>.text-sm</code>, <code>.text-lg</code>, <code>.text-xl</code> - text sizes</CardText>
            <CardText><code>.letter-spacing-1</code> to <code>.letter-spacing-5</code> - letter spacing 0.1em to 0.5em</CardText>
            <CardText><code>.z-index-1</code> to <code>.z-index-5</code> - z-index from 10 to 50</CardText>
            <CardText><code>.text-hover-primary</code>, etc. - text colour on hover/focus for theme colours</CardText>
            <CardText><code>.overflow-visible</code> and <code>.overflow-hidden</code> - overflow control</CardText>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}