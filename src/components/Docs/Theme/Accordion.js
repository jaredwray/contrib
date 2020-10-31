import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {
    Card,
    CardHeader,
    Collapse,
    CardBody,
    Label
} from 'reactstrap'

export default () => {
    const [collapse, setCollapse] = React.useState(1)

    return (
        <div id="accordion" className="docs-item element">
            <h5 className="text-uppercase mb-4">Accordion</h5>
            <div className="docs-desc">
                <p className="lead">Block components used to create an Accordion using Bootstrap' collapse plugin.</p>
            </div>
            <div className="mt-5">
                <div role="tablist">
                    <Card className="border-0 shadow mb-3">
                        <CardHeader onClick={() => setCollapse(1)} id="headingOne" role="tab" className="bg-primary-100 border-0 py-0">
                            <span style={{ cursor: "pointer" }} className="text-primary accordion-link">Option one</span>
                        </CardHeader>
                        <Collapse isOpen={collapse === 1}>
                            <CardBody className="py-5">
                                <p className="text-muted">Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. </p>
                                <p className="text-muted mb-0">Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Card className="border-0 shadow mb-3">
                        <CardHeader onClick={() => setCollapse(2)} id="headingOne" role="tab" className="bg-primary-100 border-0 py-0">
                            <span style={{ cursor: "pointer" }} className="text-primary accordion-link">Paypal</span>
                        </CardHeader>
                        <Collapse isOpen={collapse === 2}>
                            <CardBody className="py-5 d-flex align-items-center">
                                <input type="radio" name="shippping" id="payment-method-1" />
                                <Label for="payment-method-1" className="ml-3">
                                    <strong className="d-block text-uppercase mb-2"> Pay with PayPal</strong>
                                    <span className="text-muted text-sm">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            </span>
                                </Label>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Card className="border-0 shadow mb-3">
                        <CardHeader onClick={() => setCollapse(3)} id="headingOne" role="tab" className="bg-primary-100 border-0 py-0">
                            <span style={{ cursor: "pointer" }} className="text-primary accordion-link">Pay on delivery</span>
                        </CardHeader>
                        <Collapse isOpen={collapse === 3}>
                            <CardBody className="py-5 d-flex align-items-center">
                                <input type="radio" name="shippping" id="payment-method-2" />
                                <Label for="payment-method-2" className="ml-3">
                                    <strong className="d-block text-uppercase mb-2"> Pay with PayPal</strong>
                                    <span className="text-muted text-sm">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            </span>
                                </Label>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>
            </div>
            <div className="mt-5">
                <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                    {highlightCode}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

const highlightCode =
    `const [collapse, setCollapse] = React.useState(1)

return (
<div role="tablist">
    <Card className="border-0 shadow mb-3">
        <CardHeader onClick={() => setCollapse(1)} id="headingOne" role="tab" className="bg-primary-100 border-0 py-0">
            <span style={{ cursor: "pointer" }} className="text-primary accordion-link">Option one</span>
        </CardHeader>
        <Collapse isOpen={collapse === 1}>
            <CardBody className="py-5">
                <p className="text-muted">...</p>
                <p className="text-muted mb-0">...</p>
            </CardBody>
        </Collapse>
    </Card>
    <Card className="border-0 shadow mb-3">
        <CardHeader onClick={() => setCollapse(2)} id="headingOne" role="tab" className="bg-primary-100 border-0 py-0">
            <span style={{ cursor: "pointer" }} className="text-primary accordion-link">Option one</span>
        </CardHeader>
        <Collapse isOpen={collapse === 2}>
            <CardBody className="py-5">
                <p className="text-muted">...</p>
                <p className="text-muted mb-0">...</p>
            </CardBody>
        </Collapse>
    </Card>
</div>
        )`