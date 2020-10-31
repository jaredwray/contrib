import React from 'react'

import {
    Card
} from 'reactstrap'

export default () => {
    return (
        <div id="ribbon" className="docs-item element">
            <h5 className="text-uppercase mb-4">Ribbon</h5>
            <div className="docs-desc">
            <p className="lead">Ribbons can be used in the venue component, venue carousels but also separately. Its parent needs a <code>position: relative;</code> and you can use theme colours for ribbon backgrounds.</p>
            </div>
            <div className="mt-5">       
                <Card className="bg-gray-100 w-50 position-relative py-6 border-0 shadow">
                  <div className="ribbon ribbon-primary">Primary</div>
                  <div className="ribbon ribbon-secondary">Secondary</div>
                  <div className="ribbon ribbon-info">Info</div>
                </Card>
              </div>
        </div>
    )
}