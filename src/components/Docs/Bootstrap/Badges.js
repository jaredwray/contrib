import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {
    Card,
    CardBody,
    Badge
} from 'reactstrap'

export default () => {
    return (
        <div id="badges" className="docs-item element">
            <h5 className="text-uppercase mb-4">Badge</h5>
            <div className="docs-desc">
                <p className="lead">Small count and labeling component. See the <a href="https://reactstrap.github.io/components/badge/">ReactStrap documentation</a> for more details. </p>
            </div>
            <div className="mt-5">
                <Card className="mb-3">
                    <CardBody>
                        <h2>Example heading <Badge color="dark">New</Badge></h2>
                        <h3>Example heading <Badge color="secondary">New</Badge></h3>
                        <h4>Example heading <Badge color="primary">New</Badge></h4>
                        <h5>Example heading <Badge color="info">New</Badge></h5>
                        <h6>Example heading <Badge color="success">New</Badge></h6>
                    </CardBody>
                </Card>
            </div>
            <div className="mt-4">
                <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                    {highlightCode}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

const highlightCode =
    `import { Badge } from 'reactstrap'

export default () => {
    return (
        <h2>Example heading <Badge color="dark">New</Badge></h2>
        <h3>Example heading <Badge color="secondary">New</Badge></h3>
    )
}`